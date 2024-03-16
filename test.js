const generatedNumbers = new Set();

function generateNumber() {
  const prefix = '53';
  let randomNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  
  while (generatedNumbers.has(randomNumber)) {
    randomNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  }
  
  const generatedNumber = prefix + randomNumber;
  generatedNumbers.add(randomNumber);
  
  return generatedNumber;
}

console.log( generateNumber() );