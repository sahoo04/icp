import { html, render } from 'lit-html';
import { hello_backend } from 'declarations/hello_backend';
import logo from './logo2.svg';

class App {
  greeting = '';
  time = '';
  date = '';

  constructor() {
    this.#render();
    this.#startClock();
  }

  #handleSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    this.greeting = await hello_backend.greet(name);
    this.#render();
  };

  #startClock() {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();

      this.time = `${hours}:${minutes}:${seconds}`;
      this.date = `${day}/${month}/${year}`;
      this.#render();
      this.#updateAnalogClock(now);
    };

    updateClock(); // Initialize immediately
    setInterval(updateClock, 1000); // Update the clock every second
  }

  #updateAnalogClock(now) {
    const canvas = document.getElementById('analogClock');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(0, 0, radius - 10, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();

    // Draw clock hands
    const hour = (now.getHours() % 12) + now.getMinutes() / 60;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.rotate((Math.PI / 6) * hour);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius * 0.5);
    ctx.stroke();
    ctx.rotate(- (Math.PI / 6) * hour);

    ctx.rotate((Math.PI / 30) * minute);
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius * 0.7);
    ctx.stroke();
    ctx.rotate(- (Math.PI / 30) * minute);

    ctx.rotate((Math.PI / 30) * second);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius * 0.8);
    ctx.stroke();
    ctx.rotate(- (Math.PI / 30) * second);

    ctx.resetTransform();
  }

  #render() {
    let body = html`
      <main>
        <img src="${logo}" alt="DFINITY logo" />
        <br />
        <br />
        <form action="#">
          <label for="name">Enter your name: &nbsp;</label>
          <input id="name" alt="Name" type="text" />
          <button type="submit">Click Me!</button>
        </form>
        <section id="greeting">${this.greeting}</section>
        <section id="clock">
          <div id="time">${this.time}</div>
          <div id="date">${this.date}</div>
        </section>
        <section id="analogClockSection">
          <canvas id="analogClock" width="200" height="200"></canvas>
        </section>
      </main>
    `;
    render(body, document.getElementById('root'));
    document
      .querySelector('form')
      .addEventListener('submit', this.#handleSubmit);
  }
}

export default App;
