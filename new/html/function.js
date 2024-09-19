fetch("aset/json/text.json", {
  metod: "GET",
  mode: "no-cors",
  credentials: "include",
})
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    window.json = JSON.stringify(data, null, 1);
  });

const Speed(speed, cycle=3) => Math.floor(speed*(cycle*100+50)/1e4);

const Action(action, cycle=3, adwanced=0) => ((action*1e4-100*adwanced)/(cycle*100+50)).toFixed(1);

function HitRate (base) {
 return 16666.6/base - 100;
}