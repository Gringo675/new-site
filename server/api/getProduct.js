import request from "~/server/src/mysql"
import useCatProps from "~/server/src/useCatProps"

export default defineEventHandler(async (event) => {
    // функция по алиасу отдает информацию о товаре
    // const start = Date.now()

    const {alias} = useQuery(event)
    if (!alias.length) throw createError({ statusCode: 500, statusMessage: 'Parsing alias error!', fatal: true})
    // console.log(`API alias: ${alias}`);

    let query = `SELECT * FROM i_products WHERE alias = '${alias}' AND published = 1`
    const productData = (await request(query))[0]
    if (productData === undefined) throw createError({statusCode: 404, statusMessage: 'Page Not Found!!!!', fatal: true})
    // console.log(`productData: ${JSON.stringify(productData)}`);

    const props = ['p0_brand', 'p1_type', 'p2_counting_system', 'p3_range', 'p4_size',
        'p5_accuracy', 'p6_class', 'p7_feature', 'p8_pack'] // хелпер для запросов

    // получаем данные о категории
    query = `SELECT name, alias FROM i_categories 
                 WHERE id = '${productData.category_id}'`
    productData.category = (await request(query))[0]
    // отбираем подкатегории, к которым относится данный продукт
    query = `SELECT name, alias FROM i_categories 
                 WHERE parent_id = '${productData.category_id}' 
                 ${props.map(prop => `AND (${prop} = 0 OR ${prop} = ${productData[prop]}) `).join('')}
                 ORDER BY ordering`
    productData.subCats = await request(query)

    // отбираем related prods (из той же категории и максимально совпадающие по параметрам)
    query = `SELECT name, alias, price, images, ${props.join()} 
                 FROM i_products 
                 WHERE category_id = ${productData.category_id} AND id != ${productData.id} AND published = 1`
    const related = await request(query)
    related.forEach(rel => {
        rel.points = 0
        props.forEach(prop => {
            if (rel[prop] === productData[prop]) ++rel.points
        })
    })
    related.sort((a, b) => b.points - a.points)
    productData.relatedProds = []
    const ceiling = (related.length > 10 ? 10 : related.length) // возвращаем не больше 10
    for (let i = 0; i < ceiling; i++) {
        productData.relatedProds.push({
            name: related[i].name,
            alias: related[i].alias,
            price: related[i].price,
            images: related[i].images
        })
    }

    // формируем характеристики
    productData.props = []
    props.forEach( prop => {
        if (productData[prop] > 0) productData.props.push({
            name: prop,
            val: productData[prop]
        })
    })
    query = `SELECT id, name
                 FROM i_properties 
                 WHERE id IN (${productData.props.map(prop => prop.val).join()})`
    const decipherP = await request(query)
    const catProps = useCatProps(productData.category_id)
    let brandIndex // нужно вытащить из характеристик производителя в отдельное свойство
    productData.props.forEach((prop, i) => {
        if (prop.name === 'p0_brand') brandIndex = i
        prop.val = decipherP.find(item => item.id === prop.val)?.name
        prop.ordering = catProps[prop.name].ordering
        prop.name = catProps[prop.name].name
    })
    productData.brand = {
        shortName: productData.props[brandIndex].val
    }
    productData.props.splice(brandIndex, 1) // удаляем бренд из характеристик
    productData.props.sort((a, b) => a.ordering - b.ordering)
    productData.props.forEach( prop => delete prop.ordering)

    // получаем brand
    query = `SELECT full_name, image
                 FROM i_brands 
                 WHERE short_name = '${productData.brand.shortName}' LIMIT 1`
    const brand = (await request(query))[0]
    productData.brand.fullName = brand.full_name
    productData.brand.image = brand.image

    // получаем документацию
    productData.docs = {}
    if (productData.standart_ids.length) {
        query = `SELECT number, name, file FROM i_docs_stnd
                 WHERE id IN (${productData.standart_ids.replace(' ', ', ')})`
        productData.docs.stnd = await request(query)
    }
    if (productData.reestr_ids.length) {
        query = `SELECT number, name, type_si, brand, date, file_ot, file_mp, file_svid FROM i_docs_rstr
                 WHERE id IN (${productData.reestr_ids.replace(' ', ', ')})`
        productData.docs.rstr = await request(query)
    }
    if (productData.pasport_ids.length) {
        query = `SELECT name, file FROM i_docs_pasp
                 WHERE id IN (${productData.pasport_ids.replace(' ', ', ')})`
        productData.docs.pasp = await request(query)
    }

    productData.images = productData.images.split(' ') // изображения из строки в массив

    // ++label

    // удаляем ненужное
    const toDelete = ['category_id', 'old_id', 'brand_eans', 'old_price', 'vendor_price', 'vendor_old_price',
        'verification_price', 'stock', 'vendor_stock', 'hits', 'published', 'date_modified', 'date_price_changed',
        'date_vendor_price_changed', 'label_id', 'standart_ids', 'reestr_ids', 'pasport_ids']
    toDelete.forEach( name => delete productData[name])
    props.forEach( name => delete productData[name])

    // console.log(`deltaF: ${Date.now() - start}`)

    return productData


})