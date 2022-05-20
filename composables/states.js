export const useCats = () => useAsyncData('cats', async () => {
    const rowCats = await $fetch('/api/getCategories')
    // делаем "правильный" массив из натегорий (подкатегории вложены в родительские категории)
    // rowCats отсортирован по ИД, значит сначала наверняка будут основыные категории
    let cats = {}
    rowCats.forEach(cat => {
        if (cat.parent_id === 0) { // основная категория
            cats[cat.id] = cat
        } else { // "виртуальная" категория, засовываем ее в основную
            if (cats[cat.parent_id].children === undefined) cats[cat.parent_id].children = []
            cats[cat.parent_id].children.push(cat)
        }
    })
    cats = Object.values(cats).sort((a, b) => a.ordering - b.ordering) // преобразуем в массив и упорядочиваем
    cats.forEach(cat => { // упорядочиваем массив вложенных категорий
        if (cat.children !== undefined) cat.children.sort((a, b) => a.ordering - b.ordering)
    })

    return cats
});

export const useProps = () => useAsyncData('props', () => $fetch('/api/getProperties'))

