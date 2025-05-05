

function formatDate(date) {

    if(!date)return null

    try {
        const day = String(date.getDate()).padStart(2, '0'); // Obtenir le jour et le formater avec deux chiffres
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtenir le mois (0-indexé) et le formater
        const year = date.getFullYear(); // Obtenir l'année

        return `${day}-${month}-${year}`; // Retourner le format souhaité
    } catch (error) {
        return null
    }
    

    
}



module.exports = {
    formatDate,
};
