import request from "../src/mysql"

export default defineEventHandler(async (event) => {
    // функция по алиасу отдает информацию о товаре
    // const start = Date.now()
    try {
        const {alias} = useQuery(event)
        if (!alias.length) throw new Error('Alias parsing error!')
        // console.log(`API alias: ${alias}`);

        let query = `SELECT * FROM i_products WHERE alias = '${alias}' AND published = 1`
        const productData = (await request(query))[0]
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
                 ${props.map( prop => `AND (${prop} = 0 OR ${prop} = ${productData[prop]}) `).join('')}
                 ORDER BY ordering`
        productData.subCats = await request(query)

        // отбираем related prods (из той же категории и максимально совпадающие по параметрам)
        query = `SELECT name, alias, price, images, ${props.join()} 
                 FROM i_products 
                 WHERE category_id = ${productData.category_id} AND id != ${productData.id} AND published = 1`
        const related = await request(query)
        related.forEach( rel => {
            rel.points = 0
            props.forEach( prop => {
                if (rel[prop] === productData[prop]) ++rel.points
            })
        })
        related.sort((a, b) => b.points - a.points)
        productData.relatedProds = []
        const ceiling = (related.length > 10 ? 10 : related.length) // возвращаем не больше 10
        for (let i=0; i<ceiling; i++) {
            productData.relatedProds.push({
                name: related[i].name,
                alias: related[i].alias,
                price: related[i].price,
                images: related[i].images
            })
        }

        // расшифровываем характеристики
        query = `SELECT id, name
                 FROM i_properties 
                 WHERE id IN (${props.map( prop => productData[prop] ).filter( id => id > 0 ).join()})`
        const decipherP = await request(query)
        props.forEach( prop => {
            // при такой записи автоматически удалятся неиспользуемые характеристики
            productData[prop] = decipherP.find( item => item.id === productData[prop])?.name
        })

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

        // удаляем ненужное
        delete productData.category_id
        delete productData.old_id
        delete productData.brand_eans
        delete productData.old_price
        delete productData.vendor_price
        delete productData.vendor_old_price
        delete productData.verification_price
        delete productData.stock
        delete productData.vendor_stock
        delete productData.hits
        delete productData.published
        delete productData.date_modified
        delete productData.date_price_changed
        delete productData.date_vendor_price_changed
        delete productData.label_id // ???


        // console.log(`deltaF: ${Date.now() - start}`)

        return productData
    } catch (e) {
        console.log(`getProduct Error: ${e}`);
        return {}
    }

})