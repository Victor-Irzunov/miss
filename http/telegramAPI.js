import axios from 'axios'

// const token = '5562126487:AAGqX2TBd3toX15OgSCQ2yW55RNfgtBWQko'
// const chat_id = '-1001794221917'
// const token = '7011081667:AAHcqHrZS42VSMA_8JSjVQMY5hL5AdhDPs0'
// const chat_id = '-1002494900761'
const token = '8327139340:AAGFG7kRSWfzdJF8kTQpFx6S6PcWIMFyQTs'
const chat_id = '-1003114780592'

const uri_api = `https://api.telegram.org/bot${token}/sendMessage`

export const sendOrderTelegram = async (obj) => {
	const { data } = await axios.post(uri_api, {
		chat_id,
		parse_mode: 'html',
		text: obj,
	})
	return data
}






