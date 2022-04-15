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
        query = `SELECT id, name, alias, brand_id, price, images, label_id,
                 p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack
                 FROM i_products WHERE category_id = '${catID}' AND published = 1`;
        const [products] = await connection.execute(query);

        // на основе полученных продуктов создаем фильтр
        let filter = [
            {
                name: 'Тип',
                values: new Set()
            },
            {
                name: 'Система отсчета',
                values: new Set()
            },
            {
                name: 'Диапазон',
                values: new Set()
            },
        ]

        let allProps = new Set() // набор из всех уникальных id, для запроса в базу

        products.forEach((product) => {
            product.props = [] // собираем все пропсы в 1 массив, чтобы легче работать с фильтром
            if (product.p1_type > 0 ) {
                filter[0].values.add(product.p1_type)
                allProps.add(product.p1_type)
                product.props.push(product.p1_type)
            }
            if (product.p2_counting_system > 0 ) {
                filter[1].values.add(product.p2_counting_system)
                allProps.add(product.p2_counting_system)
                product.props.push(product.p2_counting_system)
            }
            if (product.p3_range > 0 ) {
                filter[2].values.add(product.p3_range)
                allProps.add(product.p3_range)
                product.props.push(product.p3_range)
            }
            // удаляем p1-p9, больше не понадобятся
            delete product.p1_type
            delete product.p2_counting_system
            delete product.p3_range
        })

        query = `SELECT id, name, ordering
                FROM i_properties 
                WHERE id IN (${Array.from(allProps).join(',')})`
        const [props] = await connection.execute(query);
        // для удобства сосздаем Map из всех параметров и Set из активных для данной категории
        let propsMap = new Map()
        props.forEach((prop) => {
            propsMap.set(prop.id, {name: prop.name, order: prop.ordering})
        })
        let activePropsSet = new Set()
        if (catData.p1_type > 0) activePropsSet.add(catData.p1_type)
        if (catData.p2_counting_system > 0) activePropsSet.add(catData.p2_counting_system)
        if (catData.p3_range > 0) activePropsSet.add(catData.p3_range)
        if (catData.p4_size > 0) activePropsSet.add(catData.p4_size)
        if (catData.p5_accuracy > 0) activePropsSet.add(catData.p5_accuracy)
        if (catData.p6_class > 0) activePropsSet.add(catData.p6_class)
        if (catData.p7_feature > 0) activePropsSet.add(catData.p7_feature)
        if (catData.p8_pack > 0) activePropsSet.add(catData.p8_pack)

        filter.forEach((group) => {
            let values = []
            group.values.forEach((valueSet) => {
                values.push({
                    val: valueSet,
                    name: propsMap.get(valueSet).name,
                    active: activePropsSet.has(valueSet),
                    order: propsMap.get(valueSet).order
                })
            })
            values.sort( (a, b) => a.order - b.order)
            group.values = values
        })
        // console.log(`filter: ${JSON.stringify(filter)}`);


        return {catData , products, filter}

    } catch (e) {
        console.log(`getCategory Error: ${e}`);
        return {}
    }

}