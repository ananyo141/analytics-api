export default function genRandomUserid(min = 240, max = 250) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
