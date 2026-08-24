const fs = require('fs');
const path = require('path');

// Chemin vers le fichier JSON (à adapter si besoin)
const filePath = path.join(__dirname, '../src/data/training.json');

try {
  // Lecture du fichier
  const rawData = fs.readFileSync(filePath, 'utf8');
  const questions = JSON.parse(rawData);

  // Mise à jour des identifiants (1, 2, 3...)
  questions.forEach((q, index) => {
    q.id = String(index + 1);
  });

  // Sauvegarde dans le fichier (avec 2 espaces d'indentation)
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');
  
  console.log(`✅ Les IDs de ${questions.length} questions ont été mis à jour avec succès dans le fichier training.json !`);
} catch (error) {
  console.error("❌ Erreur lors de la modification du fichier :", error.message);
}
