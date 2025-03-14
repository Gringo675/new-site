/**
 * переменная используется для доставки информации со страницы товара в компонент RecentlyViewed
 * вся остальная логика в компоненте RecentlyViewed
 */

const addToViewed = shallowRef()

export const useAddToViewed = () => addToViewed
