interface DlResult {
  term_price: number | null
  term_days: number | null
  door_price: number | null
  door_days: number | null
}
const config = useRuntimeConfig()

export default defineEventHandler(async event => {
  const { kladr } = getQuery(event)
  const appkey = config.DL_APP_KEY
  const kladr_chelyabinsk = '7400000100000000000000000'
  let dl: DlResult = {
    term_price: null,
    term_days: null,
    door_price: null,
    door_days: null,
  }

  const params = {
    appkey,
    derival: { city: kladr_chelyabinsk },
    arrival: { city: kladr },
  }
  try {
    const response = await $fetch('https://api.dellin.ru/v1/micro_calc.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: params,
    })
    // Defensive check for response structure
    const data = response && typeof response === 'object' && 'data' in response ? (response as any).data : undefined
    if (data?.terminals_standard?.price) {
      dl.term_price = data.terminals_standard.price
      dl.term_days = data.terminals_standard.period_to
    } else if (data?.terminals_avia?.price) {
      dl.door_price = data.terminals_avia.price
      dl.door_days = data.terminals_avia.period_to
    }
    if (data?.terminal_to_door_standard?.price) {
      dl.door_price = data.terminal_to_door_standard.price
      dl.door_days = data.terminal_to_door_standard.period_to
    } else if (data?.door_to_door_standard?.price) {
      dl.door_price = data.door_to_door_standard.price
      dl.door_days = data.door_to_door_standard.period_to
    } else if (data?.terminal_to_door_avia?.price) {
      dl.door_price = data.terminal_to_door_avia.price
      dl.door_days = data.terminal_to_door_avia.period_to
    }
    return dl
  } catch (e) {
    // Graceful error handling
    return dl
  }
})
