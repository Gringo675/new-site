import request from "../src/mysql"

export default defineEventHandler(async (event) => {
    // const start = Date.now()
    // console.log(`from getCategory`)
    // await timer(5)
    try {
        const {alias} = useQuery(event)
        if (!alias.length) throw new Error('Alias parsing error!')
        // console.log(`API alias: ${alias}`);

        // получаем категорию
        let query = `SELECT * FROM i_categories WHERE alias = '${alias}'  AND published = 1`
        // console.log(`query: ${query}`)
        const catData = (await request(query))[0]
        // console.log(`catData: ${JSON.stringify(catData)}`);
        if (catData === undefined) throw new Error('No such category!')

        // получаем дочерние категории
        query = `SELECT name, alias, image FROM i_categories 
                 WHERE parent_id = '${catData.id}' AND published = 1
                 ORDER BY ordering`
        catData.childCats = await request(query)

        // для подкатегорий получаем смежные категории и родительскую категорию
        if (catData.parent_id > 0) {
            query = `SELECT name, alias, image FROM i_categories 
                 WHERE parent_id = '${catData.parent_id}' AND id != '${catData.id}' AND published = 1
                 ORDER BY ordering`
            catData.siblingCats = await request(query)
            query = `SELECT name, alias FROM i_categories 
                 WHERE id = '${catData.parent_id}'`
            catData.parentCat = (await request(query))[0]
        }

        // получаем все товары
        const productsCatID = (catData.parent_id > 0 ? catData.parent_id : catData.id) // если нет родительской категории, значит мы уже в ней
        query = `SELECT id, name, alias, price, images, label_id,
                 p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack,
                 standart_ids, reestr_ids, pasport_ids
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
        let filterInitial = new Set() // собираем начальные значения, для сброса
        filter.forEach((fGroup) => {
            let values = []
            fGroup.values.forEach((valueSet) => {
                const value = {
                    val: valueSet,
                    name: props[valueSet].name,
                    active: catActivePropsSet.has(valueSet),
                    order: props[valueSet].order
                }
                values.push(value)
                if (value.active) filterInitial.add(value.val)
            })
            values.sort((a, b) => a.order - b.order)
            values.forEach(value => delete value.order)  // больше не нужно
            fGroup.values = values
            delete fGroup.ordering // больше не нужно
        })
        filterInitial = Array.from(filterInitial) // преобразовываем в массив, т.к. Set не передается через API
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

        // вытаскиваем документацию и записываем порядок
        const stnds = new Set()
        const rstrs = new Set()
        const pasps = new Set()
        products.forEach( (product, i) => {
            // + удалить ненужные параметры
            product.order = i
            product.standart_ids.split(' ').forEach( stnd => stnds.add(stnd))
            product.reestr_ids.split(' ').forEach( rstr => rstrs.add(rstr))
            product.pasport_ids.split(' ').forEach( pasp => pasps.add(pasp))
        })
        catData.docs = {}
        if (stnds.size) {
        //     query = `SELECT number, name, file FROM i_docs_stnd
        //          WHERE id IN (${Array.from(stnds).join(', ')})`
        //     console.log(`query: ${query}`)
        //     catData.docs.stnd = await request(query)
        }


        // удаляем ненужное
        delete catData.parent_id
        delete catData.published

        // console.log(`deltaF: ${Date.now() - start}`)

        return {catData, products, filter, filterInitial}

    } catch (e) {
        console.log(`getCategory Error: ${e}`);
        return {}
    }

})

async function timer(sec) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), sec * 1000)
    });
    return await promise;
}