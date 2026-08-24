const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/training.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const questionsMap = new Map();
const duplicatesToRemove = new Set();
const errors = [];

function areAnswersEqual(ans1, ans2) {
  if (!ans1 || !ans2) return ans1 === ans2;
  const keys1 = Object.keys(ans1).sort();
  const keys2 = Object.keys(ans2).sort();
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (ans1[key] !== ans2[key]) return false;
  }
  return true;
}

function areCorrectAnswersEqual(arr1, arr2) {
  if (!arr1 || !arr2) return arr1 === arr2;
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  for (let i = 0; i < sorted1.length; i++) {
    if (sorted1[i] !== sorted2[i]) return false;
  }
  return true;
}

data.forEach((item, index) => {
  // On normalise la question pour éviter les faux négatifs dus aux espaces ou à la casse
  const normalizedQuestion = item.question.trim().toLowerCase();
  
  if (questionsMap.has(normalizedQuestion)) {
    const existingItem = questionsMap.get(normalizedQuestion);
    
    const sameAnswers = areAnswersEqual(existingItem.answers, item.answers);
    const sameCorrectAnswers = areCorrectAnswersEqual(existingItem.correctAnswers, item.correctAnswers);
    
    if (sameAnswers && sameCorrectAnswers) {
      // Doublon parfait, on le marque pour suppression
      duplicatesToRemove.add(index);
      console.log(`[SUPPRESSION] Doublon exact trouvé : "${item.question}" (ID supprimé: ${item.id}, ID conservé: ${existingItem.id})`);
    } else {
      // Question identique mais réponses différentes
      errors.push({
        question: item.question,
        item1: { id: existingItem.id, answers: existingItem.answers, correctAnswers: existingItem.correctAnswers },
        item2: { id: item.id, answers: item.answers, correctAnswers: item.correctAnswers }
      });
    }
  } else {
    questionsMap.set(normalizedQuestion, item);
  }
});

if (errors.length > 0) {
  console.error('\n================ ERREURS DETECTEES ================');
  console.error('Des questions identiques avec des réponses différentes ont été trouvées :');
  errors.forEach(err => {
    console.error(`\n-> Question: "${err.question}"`);
    console.error(`   Item 1 (ID: ${err.item1.id}) Réponses:`, err.item1.answers, `| Correctes:`, err.item1.correctAnswers);
    console.error(`   Item 2 (ID: ${err.item2.id}) Réponses:`, err.item2.answers, `| Correctes:`, err.item2.correctAnswers);
  });
  console.error('===================================================\n');
}

const newData = data.filter((_, index) => !duplicatesToRemove.has(index));

if (duplicatesToRemove.size > 0) {
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
  console.log(`Terminé ! ${duplicatesToRemove.size} doublon(s) supprimé(s).`);
  console.log(`Il reste ${newData.length} questions dans le fichier.`);
} else {
  console.log('Aucun doublon exact à supprimer.');
}

if (errors.length > 0) {
  process.exit(1); // On quitte avec un code d'erreur si des conflits nécessitent une action manuelle
}
