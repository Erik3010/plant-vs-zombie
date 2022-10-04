class Shootable {
  constructor({ shootCb }) {
    this.shootCb();

    this.shootInterval = null;
    this.shootIntervalTime = 1000;
  }
}
