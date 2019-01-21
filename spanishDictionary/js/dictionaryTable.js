$(function() {
  let tableDataSet = getTableDataSet()
  let columnSet = [
            {title: "Term"},
            {title: "Definition"}
        ]

  //display table data using DataTable
  $('#dictionary-table').DataTable({
      data: tableDataSet,
      columns: columnSet
  })
})


function getTableDataSet() {
  return [
    ["Buenos días. Buenas tardes, Buenas noches. (Muy) Buenas.", "Good morning. Good afternoon/evening. Good night. Very good."],
    ["Hola. ¿Qué tal? ¿Cómo estás? ¿Cómo está?", "Hi. How's it going? How are you?"],
    ["Muy bien. Regular. Bien.", "Fine. OK. Good."],
    ["¿Y tú? ¿Y usted?", "And you? And yourself?"],
    ["Adiós. Hasta mañana. Hasta luego. Nos vemos.", "Good bye. See you tomorrow. See you later. See you."],
    ["¿Cómo te llamas? ¿Cómo se llama usted?", "What is your name? What's your name?(formal/polite)"],
    ["¿De donde eres (tú)? ¿De dónde es (usted)? (Yo) Soy de ____.", "Where are you from? Where are you from?(formal/polite). (I'm from) _____."],
    ["señor (Sr.), señora (Sra.), señorita (Srta.)", "Mister (Mr.), Misses (Mrs.), Miss (Ms.)"],
    ["profesor, profesora", "Professor"],
    ["Gracias. Muchas gracias.", "Thanks/Thank you. Thank you very much."],
    ["De nada. No hay de qué.", "You're welcome. No problem."],
    ["Por favor. Perdón. (Con) Permiso.", "Please. Sorry. Excuse Me."],
    ["Mucho gusto. Igualmente. Encantado/a", "Nice to meet you/pleasure is all mine. Likewise. My pleasure."],
    ["El saludo", "Greeting"],
    ["ser: soy, eres, es", "be: (I) am, (you) are, (he/she/they) are"],
    ["¿Cómo es usted?", "What are you like?"],
    ["¿Te gusta ____? ¿(A usted) Le gusta ____?", "Do you like ____? Do you like ____?(formal/polite)"],
    ["(Sí,) Me gusta ____. (No,) No me gusta ____.", "(Yes,) I like ____. (No,) I don't like ____."],
    ["los gustos", "likes"],
    ["cero", "zero"],
    ["uno", "one"],
    ["dos", "two"],
    ["tres", "three"],
    ["cuatro", "four"],
    ["cinco", "five"],
    ["seis", "six"],
    ["siete", "seven"],
    ["ocho", "eight"],
    ["nueve", "nine"],
    ["diez", "ten"],
    ["once", "eleven"],
    ["doce", "twelve"],
    ["trece", "thirteen"],
    ["catorce", "fourteen"],
    ["quince", "fifteen"],
    ["dieciséis", "sixteen"],
    ["diecisiete", "seventeen"],
    ["dieciocho", "eighteen"],
    ["diecinueve", "nineteen"],
    ["veinte", "twenty"],
    ["treinta", "thirty"],
    ["¿qué hora es?", "what time is it?"],
    ["es la… , son las…", "it is…"],
    ["y/menos cuarto (quince)", "quarter til"],
    ["y media (treinta)", "half past"],
    ["en punto", "o' clock"],
    ["de la mañana (tarde, noche)", "in the morning (afternoon/evening, night)"],
    ["¿a qué hora…? , A la(s)...", "What time...(event) , At ..."],
    ["¿cómo?", "how?; what?"],
    ["¿dónde?", "where?"],
    ["¿qué?", "what?"],
    ["¿quién?", "who?"],
    ["sí/no", "yes/no"],
    ["hay", "there is/are"],
    ["no hay", "there is not / are not"],
    ["¿hay?", "is there / are there?"],
    ["hoy/mañana", "today/tomorrow"],
    ["y/o", "and/or"],
    ["a", "to; at (with time)"],
    ["de", "of; from"],
    ["en", "in; on; at"],
    ["muy", "very"],
    ["pero", "but"],
    ["también", "also"],
    ["la palabra", "word"]
  ]
}
