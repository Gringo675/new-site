import request from "../src/mysql"

export default defineEventHandler(async (event) => {
    console.log(`from getCategory`)
    try {
        const {alias} = useQuery(event)
        if (!alias.length) throw new Error('Alias parsing error!')
        // console.log(`API alias: ${alias}`);

        // получаем категорию
        let query = `SELECT * FROM i_categories WHERE alias = '${alias}' `
        // console.log(`query: ${query}`)
        const catData = (await request(query))[0]
        // console.log(`catData: ${JSON.stringify(catData)}`);
        if (catData === undefined) throw new Error('No such category!')

        // получаем дочерние категории
        query = `SELECT id, name, alias, image FROM i_categories 
                 WHERE parent_id = '${catData.id}' AND published = 1
                 ORDER BY ordering`
        catData.childCats = await request(query)

        // для подкатегорий получаем смежные категории
        if (catData.parent_id > 0) {
            query = `SELECT id, name, alias, image FROM i_categories 
                 WHERE parent_id = '${catData.parent_id}' AND id != '${catData.id}' AND published = 1
                 ORDER BY ordering`
            catData.siblingCats = await request(query)
        }

        // получаем все товары
        const productsCatID = (catData.parent_id > 0 ? catData.parent_id : catData.id) // если нет родительской категории, значит мы уже в ней
        query = `SELECT id, name, alias, price, images, label_id,
                 p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack
                 FROM i_products WHERE category_id = '${productsCatID}' AND published = 1`;
        // query += ` AND old_id IN (11010301, 11010801, 11011501)`
        const products = await request(query)
        // console.log(`products: ${JSON.stringify(products, null, 2)}`)

        // на основе полученных продуктов создаем фильтр
        const filterGroups = {
            // объект создает сопоставление между полями в таблице mysql и фильтром на сайте
            p1_type: {
                name: 'Тип',
                ordering: 10
            },
            p2_counting_system: {
                name: 'Система отсчета',
                ordering: 20
            },
            p3_range: {
                name: 'Диапазон измерений',
                ordering: 30
            },
            p4_size: {
                name: 'Размерность',
                ordering: 40
            },
            p5_accuracy: {
                name: 'Точность отсчета',
                ordering: 50
            },
            p6_class: {
                name: 'Класс',
                ordering: 60
            },
            p7_feature: {
                name: 'Особенности',
                ordering: 70
            },
            p0_brand: {
                name: 'Производитель',
                ordering: 80
            },
            p8_pack: {
                name: 'Упаковка',
                ordering: 90
            }
        }
        // далее можно задать частные случаи - особые имена и порядок для отдельных категорий
        // if (cat_id = ...) {filter.p4_size.name = 'Длина'; filter.p4_size.ordering = 25}

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
                    // console.log(`filter ${propKey} size: ${filter[propKey].values.size}`);
                }
                delete product[propKey] // удаляем, больше не понадобится
            })
        }

        // console.log(`filter: ${JSON.stringify(filter)}`);
        // console.log(`allProps: ${Array.from(allProps).join(',')}`);
        // console.log(`catActivePropsSet: ${Array.from(catActivePropsSet).join(',')}`);

        // получаем пропсы
        query = `SELECT id, name, ordering
                FROM i_properties 
                WHERE id IN (${Array.from(allProps).join(',')})`
        const propsArr = await request(query)

        const props = {} // для удобства создаем объект из всех пропсов
        propsArr.forEach((prop) => {
            props[prop.id] = {name: prop.name, order: prop.ordering}
        })
        filter = Object.values(filter).sort((a, b) => a.ordering - b.ordering) // преобразуем объект в массив и сортируем
        filter.forEach((fGroup) => {
            let values = []
            fGroup.values.forEach((valueSet) => {
                values.push({
                    val: valueSet,
                    name: props[valueSet].name,
                    active: catActivePropsSet.has(valueSet),
                    order: props[valueSet].order
                })
            })
            values.sort((a, b) => a.order - b.order)
            values.forEach(value => delete value.order)  // больше не нужно
            fGroup.values = values
            delete fGroup.ordering // больше не нужно
        })
        // console.log(`filter array: ${JSON.stringify(filter)}`);

        // упорядочиваем товары по фильтру
        products.sort((a, b) => {
            for (const fGroup of filter) {
                for (const prop of fGroup.values) {
                    const isA = a.props.includes(prop.val)
                    const isB = b.props.includes(prop.val)
                    if (isA && !isB) return -1
                    if (!isA && isB) return 1
                }
            }
            return 0
        })
        products.forEach( (product, i) => product.order = i) // записываем порядок

        return {catData, products, filter}

    } catch (e) {
        console.log(`getCategory Error: ${e}`);
        return {}
    }

})