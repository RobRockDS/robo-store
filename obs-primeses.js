const {observable}=require('rxjs')

const doSomething=()=>{
  return new Promise((resolve)=>{
    resolve('valor1');
  });
}

(async ()=>{
  const rta =await doSomething();
  console.log(rta);
})
