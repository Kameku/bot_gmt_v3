const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')





const flowThanks = addKeyword(['ok', 'gracias'])
    .addAnswer("Un agusto ayudarte, Buen dia")
    

const flowVerifyPay = addKeyword(['1', 'pagos', 'quiero saber cuando me pagan', 'cuando pagan'])
    .addAnswer("En este link pododras consultar por la placa\nde tu vehiculo el estado de tu pago.")
    .addAnswer("https://appgmt.com")
    .addAnswer("Solo debes escribir *la placa de tu vehiculo* \n y dar click en *Consultar*", {
        media:'https://app.gmtcarga.com/gmtapp.jpg'
    })
    
const flowCertificados = addKeyword(['2','certificados','necesito el certificado'])
    .addAnswer('Para obtener el certificados\n de ingresos y retenciones')
    .addAnswer('Envia una solicitud al correo')
    .addAnswer('*oficina@gmtcarga.com*')
    .addAnswer('*contabilidad@gmtcarga.com*')

const flowOther = addKeyword(['3', 'asesor'])
    .addAnswer('Entiendo en breve un asesor te dara respuesta')
    .addAnswer(
        [
            "O recuerda nuestras opciones de consulta",
            "👉🏻 1️⃣ 👈🏻. *Verificacion de pagos*",
            "👉🏻 2️⃣ 👈🏻. *Certificados de Ingresos o Retenciones*",
        ],
        null,
        null,
        [flowVerifyPay, flowCertificados]
    )
    .addAnswer('*Gracias, por favor espera....*', {capture:true}, (ctx)=>{
        if(ctx.body == 'asesor'){
            return console.log(ctx.body)
        }
    })



const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('🙌 Hola! Bienvenido a GMT transportes logisticos')
    .addAnswer("Mi nombre es Clara y te voy ayudar con tu solicitud",)
    .addAnswer(
        [
            "Si necesitas ver más info sobre",
            "👉🏻 1️⃣ 👈🏻. *Verificacion de pagos*",
            "👉🏻 2️⃣ 👈🏻. *Certificados de Ingresos o Retenciones*",
            "👉🏻 3️⃣ 👈🏻. *Otra consulta*"
        ],
        null,
        null,
        [flowVerifyPay, flowCertificados, flowOther, flowThanks]
    )



const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowThanks])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
