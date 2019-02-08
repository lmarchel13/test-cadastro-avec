const test = async () => {
  await setTimeout(() => {
    console.log('1');
  }, 2000);
};

console.log('0');
test();

console.log('2');
