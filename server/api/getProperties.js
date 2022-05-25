import request from "../src/mysql";
import {defineHandler} from 'h3'

export default defineHandler(async () => {
    // console.log(`from getProperties`);
    try {
        // const query = `SELECT * FROM i_properties WHERE group_id=0 ORDER by group_id, ordering`
        const query = `SELECT * FROM i_properties ORDER by group_id, ordering`
        const rowProps = await request(query)
        // разделим параметры на группы
        const props = {
            brand: [],
            type: [],
            counting_system: [],
            range: [],
            size: [],
            accuracy: [],
            class: [],
            feature: [],
            pack: []
        }
        for (const prop of rowProps) {
            switch (prop.group_id) {
                case 0:
                    props.brand.push(prop)
                    break
                case 1:
                    props.type.push(prop)
                    break
                case 2:
                    props.counting_system.push(prop)
                    break
                case 3:
                    props.range.push(prop)
                    break
                case 4:
                    props.size.push(prop)
                    break
                case 5:
                    props.accuracy.push(prop)
                    break
                case 6:
                    props.class.push(prop)
                    break
                case 7:
                    props.feature.push(prop)
                    break
                case 8:
                    props.pack.push(prop)
                    break
            }
        }
        return props

    } catch (e) {
        console.log(`getProperties Error: ${e}`);
        return {}
    }
})