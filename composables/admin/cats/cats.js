import myFetch from "~/composables/common/myFetch"

export default reactive({
    items: [],
    async getItems () {
        this.items = await myFetch('/api/admin/getCategories', {auth: true})
    }
})