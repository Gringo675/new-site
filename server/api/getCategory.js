import mysql from 'mysql2/promise'

const newBaseData = {
    host: process.env.DB_HOST_LOCAL,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
};

export default async (req) => {
    try {
        // вытаскиваем алиас из req.url
        if (!req.url.startsWith('/api/getCategory?alias=')) throw new Error('Alias parsing error!')
        const alias = req.url.substring(23)
        // console.log(`API alias: ${alias}`);

        const connection = await mysql.createConnection(newBaseData)

        // получаем категорию
        let query = `SELECT * FROM i_categories WHERE alias = '${alias}' `;
        const [rows] = await connection.execute(query);
        const catData = rows[0]
        // console.log(`catData: ${JSON.stringify(catData)}`);

        // получаем все товары
        const catID = (catData.parent_id > 0 ? catData.parent_id : catData.id) // если нет родительской категории, значит мы уже в ней
        query = `SELECT id, name, alias, price, images, label_id,
                 p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack
                 FROM i_products WHERE category_id = '${catID}' AND published = 1`;
        const [products] = await connection.execute(query);

        // на основе полученных продуктов создаем фильтр
        const filterGroups = {
            // объект создает сопоставление между полями в таблице mysql и фильтром на сайте
            p1_type: {
                name: 'Тип',
                ordering: 1
            },
            p2_counting_system: {
                name: 'Система отсчета',
                ordering: 2
            },
            p3_range: {
                name: 'Диапазон измерений',
                ordering: 3
            },
            p4_size: {
                name: 'Размерность',
                ordering: 4
            },
            p5_accuracy: {
                name: 'Точность отсчета',
                ordering: 5
            },
            p6_class: {
                name: 'Класс',
                ordering: 6
            },
            p7_feature: {
                name: 'Особенности',
                ordering: 7
            },
            p0_brand: {
                name: 'Производитель',
                ordering: 8
            },
            p8_pack: {
                name: 'Упаковка',
                ordering: 9
            }
        }
        // далее можно задать частные случаи - особые имена и порядок для отдельных категорий
        // if (cat_id = ...) {filter.p4_size.name = 'Длина'}


        let filter = {}
        let allProps = new Set() // набор из всех уникальных id, для запроса в базу
        let catActivePropsSet = new Set()  // Set из активных для данной категории пропсов

        for (let propKey in filterGroups) {
            if (catData[propKey] > 0) catActivePropsSet.add(catData[propKey])

            products.forEach((product) => {
                if (product[propKey] > 0) {
                    if (filter[propKey] === undefined) { // первое обращение, нужно создать
                        filter[propKey] = filterGroups[propKey]
                        filter[propKey].values = new Set()
                    }
                    filter[propKey].values.add(product[propKey])
                    allProps.add(product[propKey])
                    if (product.props === undefined) product.props = [] // собираем все пропсы в 1 массив, чтобы легче работать с фильтром
                    product.props.push(product[propKey])
                    delete product[propKey] // удаляем, больше не понадобится
                    // console.log(`filter ${propKey} size: ${filter[propKey].values.size}`);
                }
            })
        }

        // console.log(`filter: ${JSON.stringify(filter)}`);
        // console.log(`allProps: ${Array.from(allProps).join(',')}`);
        // console.log(`catActivePropsSet: ${Array.from(catActivePropsSet).join(',')}`);

        // получаем пропсы
        query = `SELECT id, name, ordering
                FROM i_properties 
                WHERE id IN (${Array.from(allProps).join(',')})`
        const [props] = await connection.execute(query);

        let propsMap = new Map() // для удобства создаем Map из всех пропсов
        props.forEach((prop) => {
            propsMap.set(prop.id, {name: prop.name, order: prop.ordering})
        })

        filter = Object.values(filter).sort((a, b) => a.ordering - b.ordering) // преобразуем объект в массив и сортируем
        filter.forEach((fGroup) => {
            let values = []
            fGroup.values.forEach((valueSet) => {
                values.push({
                    val: valueSet,
                    name: propsMap.get(valueSet).name,
                    active: catActivePropsSet.has(valueSet),
                    order: propsMap.get(valueSet).order
                })
            })
            values.sort((a, b) => a.order - b.order)
            values.forEach(value => delete value.order)  // больше не нужно
            fGroup.values = values
            delete fGroup.ordering // больше не нужно
        })
        // console.log(`filter array: ${JSON.stringify(filter)}`);


        return {catData, products, filter}

    } catch (e) {
        console.log(`getCategory Error: ${e}`);
        return {}
    }

}