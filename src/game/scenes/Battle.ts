import { Scene, GameObjects } from 'phaser';

export class Battle extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super('Battle');
  }

  create() {
    const bg = this.add.image(0, 0, 'background').setOrigin(0);
    const { width: bgWidth, height: bgHeight } = bg;
    const { width: screenWidth, height: screenHeight } = this.scale;
    const scaleX = screenWidth / bgWidth;
    const scaleY = screenHeight / bgHeight;
    const scale = Math.max(scaleX, scaleY);

    bg.setScale(scale);

    this.logo = this.add
      .image(0, 0, 'logo')
      .setOrigin(0.5)
      .setPosition(this.scale.width / 2, this.scale.height / 2);

    this.title = this.add
      .text(512, 460, 'Main Menu', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);
  }
}
