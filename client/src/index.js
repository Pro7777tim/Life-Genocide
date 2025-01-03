//variables -
let player;
let blocks = [];
let blocksGroup;
let mobs = [];
let mobsGroup;
let mobsV = [];
let monsters = [];
let monstersV = [];
let monstersGroup;
let military = [];
let militaryGroup;
let impassable = [];
let impassableGroup;
let objects = [];
let objectsGroup;
let cursorsX;
let cursorsY;
let shakeX = 0;
let shakeY = 0;
let hpBar;
let stBar;
let hgBar;
let armBar;
let textArm;
let textHg;
let textSt;
let textHp;
let hpOverlay;
let stOverlay;
let hgOverlay;
let background;
let index;
let gameSCn;
let interfaceSCn;
let isMobile;
let up;
let down;
let left;
let right;
let shift;
let intervalX;
let intervalY;
let flag;
let zom_flag;
let isDownBt = false;
let sault = false;
let ISS1 = false;
let CSS1 = true;
let ISS2 = true;
let CSS2 = false;
let IA1 = true;

let drawButton = (x, y, arrowDirection, size) => {
    const button = interfaceSCn.add.graphics();
    button.fillStyle(0xffffff, 1);
    button.fillRect(x, y, size, size);
    button.lineStyle(2, 0x000000, 1);
    button.strokeRect(x, y, size, size);
    const arrow = interfaceSCn.add.graphics();
    arrow.lineStyle(4, 0x000000, 1);
    switch (arrowDirection) {
        case "up":
            arrow.strokeTriangle(
                x + size / 2,
                y + 10,
                x + 10,
                y + size - 10,
                x + size - 10,
                y + size - 10
            );
            break;
        case "down":
            arrow.strokeTriangle(
                x + 10,
                y + 10,
                x + size - 10,
                y + 10,
                x + size / 2,
                y + size - 10
            );
            break;
        case "left":
            arrow.strokeTriangle(
                x + 10,
                y + size / 2,
                x + size - 10,
                y + 10,
                x + size - 10,
                y + size - 10
            );
            break;
        case "right":
            arrow.strokeTriangle(
                x + 10,
                y + 10,
                x + 10,
                y + size - 10,
                x + size - 10,
                y + size / 2
            );
            break;
    }
    const hitArea = new Phaser.Geom.Rectangle(x, y, size, size);
    button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    return button;
};

let subjectCN = function (
    srcLG,
    srcAN,
    broken,
    grouping,
    damage,
    armor,
    clickCB,
    rlickCB,
    select,
    draw,
    cursor
) {
    this.srcLG = srcLG;
    this.srcAN = srcAN;
    this.broken = broken;
    this.grouping = grouping;
    this.damage = damage;
    this.armor = armor;
    this.clickCB = clickCB;
    this.select = select;
    this.draw = draw;
    this.cursor = cursor;
    this.rlickCB = rlickCB;
};

let mobsCN = function (
    animation,
    damage,
    ramage,
    health,
    speed,
    alCB,
    clickCB,
    draw,
    x,
    y
) {
    this.animation = animation;
    this.damage = damage;
    this.ramage = ramage;
    this.health = health;
    this.speed = speed;
    this.alCB = alCB;
    this.clickCB = clickCB;
    this.draw = draw;
    this.x = x;
    this.y = y;
};

let blockCN = function (src, draw, hp, touchCB, CB, damage, x, y, impassable) {
    this.src = src;
    this.draw = draw;
    this.hp = hp;
    this.touchCB = touchCB;
    this.CB = CB;
    this.damage = damage;
    this.x = x;
    this.y = y;
    this.impassable = impassable;
};

const playerOj = {
    health: 100,
    stamina: 100,
    hunger: 100,
    cold: false,
    armor: 0,
    speed: 160,
    soundness: 4,
    inventory: [],
    framesV: [],
    subjectV: [],
};

const world = {
    flagHP: 1000,
    time: "day",
    wave: 0,
    frost: false,
};

//game
const gameSC = {
    key: "sprite",
    preload: function () {
        this.load.image("background", "src/img/bg.png");
        this.load.spritesheet("man", "src/img/man.png", {
            frameWidth: 50,
            frameHeight: 80,
        });
        this.load.spritesheet("zombie", "src/img/zombie.png", {
            frameWidth: 50,
            frameHeight: 80,
        });
        this.load.image("flag", "src/img/flag.png");
        this.load.image("zom_flag", "src/img/zom_flag.png");
        this.load.image("board", "src/img/board.png");
        this.load.image("cobblestone", "src/img/cobblestone.png");
        this.load.image("bench", "src/img/bench.png");
        this.load.image("stone", "src/img/stone.png");
        this.load.image("oven", "src/img/oven.png");
    },
    changeTint: function (intensity, img) {
        if (img !== undefined) {
            if (img.active) {
                let scaledValue = Phaser.Math.Linear(50, 255, intensity / 100);
                let tintValue = Phaser.Display.Color.GetColor(
                    scaledValue,
                    scaledValue,
                    scaledValue
                );
                img.setTint(tintValue);
            }
        }
    },
    changeRedTint: function (intensity, img) {
        if (img !== undefined) {
            if (img.active) {
                if (intensity < 80) {
                    let redValue = Phaser.Math.Linear(255, 50, intensity / 100);
                    let greenValue = 255 - redValue;
                    let blueValue = 255 - redValue;
                    let tintValue = Phaser.Display.Color.GetColor(
                        redValue,
                        greenValue,
                        blueValue
                    );
                    img.setTint(tintValue);
                }
            }
        }
    },
    isColliding: function (rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    },
    create: function () {
        //camera
        this.cameras.main.setBounds(0, 0, 4000, 4000);
        this.cameras.main.setZoom(2);
        this.cameras.main.setSize(1280, 720);
        //create background and tools
        background = this.add.image(2000, 2000, "background");
        background.setDisplaySize(4000, 4000);
        this.physics.world.setBounds(0, 0, 4000, 4000);
        this.scene.launch("interface");
        this.scene.bringToTop("interface");
        background.setDepth(0);
        gameSCn = game.scene.getScene("sprite");
        interfaceSCn = game.scene.getScene("interface");
        isMobile =
            this.sys.game.device.os.android || this.sys.game.device.os.iOS;
        this.input.mouse.disableContextMenu();
        blocksGroup = this.physics.add.staticGroup();
        militaryGroup = this.physics.add.staticGroup();
        monstersGroup = this.physics.add.group();
        mobsGroup = this.physics.add.group();
        impassableGroup = this.physics.add.staticGroup();
        objectsGroup = this.physics.add.staticGroup();

        //player
        this.anims.create({
            key: "turn",
            frames: this.anims.generateFrameNumbers("man", {
                start: 0,
                end: 0,
            }),
            frameRate: 1,
            repeat: 0,
        });
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("man", {
                start: 2,
                end: 4,
            }),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: "sault",
            frames: this.anims.generateFrameNumbers("man", {
                start: 5,
                end: 9,
            }),
            frameRate: 8,
            repeat: -1,
        });
        player = this.physics.add.sprite(600, 600, "man");
        player.setDisplaySize(70, 100);
        player.body.setSize(30, 65);
        player.play("turn");
        this.cameras.main.startFollow(player);
        player.setCollideWorldBounds(true);
        player.setDepth(2);
        player.mObj = playerOj;

        //overlap
        this.physics.add.collider(player, blocksGroup, (playerO, obj) => {
            obj.mObj.overCB(playerO.mObj);
        });
        this.physics.add.overlap(player, mobsGroup, (playerO, obj) => {
            obj.mObj.overCB(playerO.mObj);
        });
        this.physics.add.overlap(player, monstersGroup, (playerO, obj) => {
            obj.mObj.overCB(playerO.mObj);
        });
        this.physics.add.overlap(player, militaryGroup, (playerO, obj) => {
            obj.mObj.overCB(playerO.mObj);
        });
        this.physics.add.overlap(player, impassableGroup, (playerO, obj) => {
            obj.mObj.overCB(playerO.mObj);
        });
        this.physics.add.overlap(player, objectsGroup, (playerO, obj) => {
            obj.mObj.overCB(playerO.mObj);
        });
        //monster
        this.physics.add.collider(
            monstersGroup,
            blocksGroup,
            (monster, block) => {
                block.mObj.overCB(monster.mObj);
                monster.mObj.overCB(block.mObj);
            }
        );
        this.physics.add.overlap(
            monstersGroup,
            militaryGroup,
            (monster, military) => {
                military.mObj.overCB(monster.mObj);
                monster.mObj.overCB(military.mObj);
            }
        );
        this.physics.add.overlap(
            monstersGroup,
            impassableGroup,
            (monster, impassable) => {
                impassable.mObj.overCB(monster.mObj);
                monster.mObj.overCB(impassable.mObj);
            }
        );
        this.physics.add.overlap(monstersGroup, mobsGroup, (monster, mob) => {
            mob.mObj.overCB(monster.mObj);
            monster.mObj.overCB(mob.mObj);
        });
        this.physics.add.collider(
            monstersGroup,
            objectsGroup,
            (monster, obj) => {
                obj.mObj.overCB(monster.mObj);
                monster.mObj.overCB(obj.mObj);
            }
        );
        this.physics.add.overlap(
            monstersGroup,
            monstersGroup,
            (monster, monster2) => {
                monster2.mObj.overCB(monster.mObj);
                monster.mObj.overCB(monster2.mObj);
            }
        );
        //mobs
        this.physics.add.collider(mobsGroup, blocksGroup, (mob, block) => {
            block.mObj.overCB(mob.mObj);
            mob.mObj.overCB(block.mObj);
            mob.mObj.moveV.change = true;
        });
        this.physics.add.overlap(mobsGroup, militaryGroup, (mob, military) => {
            military.mObj.overCB(mob.mObj);
            mob.mObj.overCB(military.mObj);
        });
        this.physics.add.overlap(
            mobsGroup,
            impassableGroup,
            (mob, impassable) => {
                impassable.mObj.overCB(mob.mObj);
                mob.mObj.overCB(impassable.mObj);
            }
        );
        this.physics.add.overlap(mobsGroup, mobsGroup, (mob, mob2) => {
            mob.mObj.overCB(mob2.mObj);
            mob2.mObj.overCB(mob.mObj);
        });
        this.physics.add.collider(mobsGroup, objectsGroup, (mob, obj) => {
            obj.mObj.overCB(mob.mObj);
            mob.mObj.overCB(obj.mObj);
            mob.mObj.moveV.change = true;
        });
        this.physics.add.overlap(mobsGroup, monstersGroup, (mob, monster) => {
            mob.mObj.overCB(monster.mObj);
            monster.mObj.overCB(mob.mObj);
        });

        //flag
        flag = this.physics.add.staticImage(560 - 25, 560 - 25, "flag");
        flag.setDisplaySize(50, 50);
        flag.setDepth(1);
        flag.body.setSize(40, 40);
        flag.body.setOffset(4, 4);
        zom_flag = this.physics.add.staticImage(
            3500 - 25,
            3500 - 25,
            "zom_flag"
        );
        zom_flag.setDisplaySize(50, 50);
        zom_flag.setDepth(1);
        zom_flag.body.setSize(40, 40);
        zom_flag.body.setOffset(4, 4);

        //create mobs
        this.anims.create({
            key: "zombie_walk",
            frames: this.anims.generateFrameNumbers("zombie", {
                start: 0,
                end: 3,
            }),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "zombie_attack",
            frames: this.anims.generateFrameNumbers("zombie", {
                start: 4,
                end: 7,
            }),
            frameRate: 6,
            repeat: -1,
        });
    },
    update: function () {
        //cursors
        cursorsX = this.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
        });
        cursorsY = this.input.keyboard.addKeys({
            s: Phaser.Input.Keyboard.KeyCodes.S,
            w: Phaser.Input.Keyboard.KeyCodes.W,
        });
        otherKey = this.input.keyboard.addKeys({
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        });

        //walk
        if (!isMobile) {
            if (cursorsX.a.isDown) {
                player.setVelocityX(-playerOj.speed);
                player.flipX = true;
            }
            if (cursorsX.d.isDown) {
                player.setVelocityX(playerOj.speed);
                player.flipX = false;
            }
            if (cursorsY.w.isDown) {
                player.setVelocityY(-playerOj.speed);
            }
            if (cursorsY.s.isDown) {
                player.setVelocityY(playerOj.speed);
            }

            if (
                !cursorsX.a.isDown &&
                !cursorsY.w.isDown &&
                !cursorsX.d.isDown &&
                !cursorsY.s.isDown
            ) {
                if (!sault) {
                    player.anims.play("turn");
                }
                shakeX = 0;
                shakeY = 0;
                this.cameras.main.x = shakeX;
                this.cameras.main.y = shakeY;
                if (playerOj.stamina < 100 && playerOj.hunger > 10) {
                    playerOj.stamina = playerOj.stamina + 0.3;
                    playerOj.hunger = playerOj.hunger - 0.002;
                }
            } else {
                if (!sault) {
                    player.anims.play("walk", true);
                }
                shakeX = Math.sin(this.time.now / 100) * 0.3;
                shakeY = Math.cos(this.time.now / 100) * 0.3;
                this.cameras.main.x += shakeX;
                this.cameras.main.y += shakeY;
                if (playerOj.stamina > 0) {
                    playerOj.stamina = playerOj.stamina - 0.05;
                }
            }

            if (!cursorsY.w.isDown && !cursorsY.s.isDown) {
                player.setVelocityY(0);
            }
            if (!cursorsX.a.isDown && !cursorsX.d.isDown) {
                player.setVelocityX(0);
            }

            //sault
            if (
                otherKey.shift.isDown &&
                playerOj.stamina > 30 &&
                playerOj.health > 20
            ) {
                if (!sault && ISS2) {
                    sault = true;
                    playerOj.speed = playerOj.speed + 60;
                    playerOj.stamina = playerOj.stamina - 5;
                    player.anims.play("sault", true);
                    gameSCn.time.delayedCall(1300, () => {
                        sault = false;
                        playerOj.speed = playerOj.speed - 60;
                        player.anims.play("turn");
                        ISS2 = true;
                    });
                    ISS2 = false;
                }
            }
        }

        //blocks
        for (let i = blocks.length - 1; i >= 0; i--) {
            let el = blocks[i];
            let block = blocksGroup.getChildren();

            if (el.draw == false) {
                blocksGroup.create(el.x - 25, el.y - 25, el.src);
                block = blocksGroup.getChildren();
                block[i].setDisplaySize(el.size[0], el.size[1]);
                block[i].body.setSize(el.size[2], el.size[3]);
                block[i].body.setOffset(el.size[4], el.size[5]);
                block[i].setDepth(1);
                block[i].mObj = el;

                el.draw = true;
                gameSC.changeTint(el.hp, block[i]);
                el.tint = this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        gameSC.changeTint(el.hp, block[i]);
                    },
                    callbackScope: this,
                    loop: true,
                });
            } else if (el.draw == true) {
                el.alwCB();
            } else if (el.draw == "remove") {
                el.tint.remove();
                blocksGroup.remove(block[i], true, true);
                blocks.splice(i, 1);
            }
            if (el.hp <= 0) {
                el.draw = "remove";
            }
        }

        //impassable
        for (let i = impassable.length - 1; i >= 0; i--) {
            let el = impassable[i];
            let impassabl = impassableGroup.getChildren();

            if (el.draw == false) {
                impassableGroup.create(el.x - 25, el.y - 25, el.src);
                impassabl = impassableGroup.getChildren();
                impassabl[i].setDisplaySize(el.size[0], el.size[1]);
                impassabl[i].body.setSize(el.size[2], el.size[3]);
                impassabl[i].body.setOffset(el.size[4], el.size[5]);
                impassabl[i].setDepth(1);
                impassabl[i].mObj = el;

                el.draw = true;
                gameSC.changeTint(el.hp, impassabl[i]);
                el.tint = this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        gameSC.changeTint(el.hp, impassabl[i]);
                    },
                    callbackScope: this,
                    loop: true,
                });
            } else if (el.draw == true) {
                el.alwCB();
            } else if (el.draw == "remove") {
                el.tint.remove();
                impassableGroup.remove(impassabl[i], true, true);
                impassable.splice(i, 1);
            }
            if (el.hp <= 0) {
                el.draw = "remove";
            }
        }

        //objects
        for (let i = objects.length - 1; i >= 0; i--) {
            let el = objects[i];
            let object = objectsGroup.getChildren();

            if (el.draw == false) {
                objectsGroup.create(el.x - 25, el.y - 25, el.src);
                object = impassableGroup.getChildren();
                object[i].setDisplaySize(el.size[0], el.size[1]);
                object[i].body.setSize(el.size[2], el.size[3]);
                object[i].body.setOffset(el.size[4], el.size[5]);
                object[i].setDepth(1);
                object[i].mObj = el;

                el.draw = true;
                gameSC.changeTint(el.hp, object[i]);
                el.tint = this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        gameSC.changeTint(el.hp, object[i]);
                    },
                    callbackScope: this,
                    loop: true,
                });
            } else if (el.draw == true) {
                el.alwCB();
            } else if (el.draw == "remove") {
                el.tint.remove();
                impassableGroup.remove(object[i], true, true);
                objects.splice(i, 1);
            }
            if (el.hp <= 0) {
                el.draw = "remove";
            }
        }

        //military
        for (let i = military.length - 1; i >= 0; i--) {
            let el = military[i];
            let militar = militaryGroup.getChildren();

            if (el.draw == false) {
                militaryGroup.create(el.x - 25, el.y - 25, el.src);
                militar = militaryGroup.getChildren();
                militar[i].setDisplaySize(el.size[0], el.size[1]);
                militar[i].body.setSize(el.size[2], el.size[3]);
                militar[i].body.setOffset(el.size[4], el.size[5]);
                militar[i].setDepth(1);
                militar[i].mObj = el;

                el.draw = true;
                gameSC.changeTint(el.health, militar[i]);
                el.tint = this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        gameSC.changeTint(el.health, militar[i]);
                    },
                    callbackScope: this,
                    loop: true,
                });
            } else if (el.draw == true) {
                el.alwCB();
            } else if (el.draw == "remove") {
                el.tint.remove();
                militaryGroup.remove(militar[i], true, true);
                military.splice(i, 1);
            }
            if (el.health <= 0) {
                el.draw = "remove";
            }
        }

        //monsters
        for (let i = monsters.length - 1; i >= 0; i--) {
            let el = monsters[i];

            if (el.draw == false) {
                monstersV[i] = gameSCn.physics.add.sprite(el.x, el.y, el.key);
                monstersV[i].setDisplaySize(el.size[0], el.size[1]);
                monstersV[i].body.setSize(el.size[2], el.size[3]);
                monstersV[i].body.setOffset(el.size[4], el.size[5]);
                monstersV[i].setCollideWorldBounds(true);
                monstersV[i].setDepth(2);
                monstersV[i].anims.play(el.animation[0], true);
                monstersV[i].mObj = el;
                monstersGroup.add(monstersV[i]);
                monstersV[i].setCollideWorldBounds(true);

                el.draw = true;
                gameSC.changeRedTint(el.health, monstersV[i]);
                el.tint = this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        gameSC.changeRedTint(el.health, monstersV[i]);
                    },
                    callbackScope: this,
                    loop: true,
                });
            } else if (el.draw == true) {
                el.alwCB();
            } else if (el.draw == "remove") {
                el.tint.remove();
                monstersGroup.remove(monstersV[i], true);
                monstersV[i].body.destroy();
                monstersV[i].destroy();
                monstersV.splice(i, 1);
                monsters.splice(i, 1);
            }
            if (el.health <= 0) {
                el.draw = "remove";
            }
        }
        //mobs
        for (let i = mobs.length - 1; i >= 0; i--) {
            let el = mobs[i];

            if (el.draw == false) {
                mobsV[i] = gameSCn.physics.add.sprite(el.x, el.y, el.key);
                mobsV[i].setDisplaySize(el.size[0], el.size[1]);
                mobsV[i].body.setSize(el.size[2], el.size[3]);
                mobsV[i].body.setOffset(el.size[4], el.size[5]);
                mobsV[i].setCollideWorldBounds(true);
                mobsV[i].setDepth(2);
                mobsV[i].anims.play(el.animation[0], true);
                mobsV[i].mObj = el;
                mobsGroup.add(mobsV[i]);
                mobsV[i].setCollideWorldBounds(true);

                el.draw = true;
                gameSC.changeRedTint(el.health, mobsV[i]);
                el.tint = this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        gameSC.changeRedTint(el.health, mobsV[i]);
                    },
                    callbackScope: this,
                    loop: true,
                });
            } else if (el.draw == "remove") {
                el.tint.remove();
                mobsGroup.remove(mobsV[i], true);
                mobsV[i].body.destroy();
                mobsV[i].destroy();
                mobsV.splice(i, 1);
                mobs.splice(i, 1);
            } else if (el.draw == true) {
                el.alwCB();
                if (el.moveV !== undefined) {
                    if (el.moveV.hp == undefined) {
                        el.moveV.hp = el.health;
                    } else {
                        if (el.moveV.hp !== el.health) {
                            el.state = "hpNone";
                            el.moveV.hp = el.health;
                        }
                    }
                }
                if (el.state == "run") {
                    let angle = Phaser.Math.Angle.Between(
                        mobsV[i].x,
                        mobsV[i].y,
                        el.moveV.run.x,
                        el.moveV.run.y
                    );
                    let distance = Phaser.Math.Distance.Between(
                        mobsV[i].x,
                        mobsV[i].y,
                        el.moveV.run.x,
                        el.moveV.run.y
                    );
                    if (distance > 30) {
                        mobsV[i].setVelocity(
                            Math.cos(angle) * el.speed,
                            Math.sin(angle) * el.speed
                        );
                    } else {
                        el.state = "none";
                    }
                    if (
                        mobsV[i].body.touching.up ||
                        mobsV[i].body.touching.down ||
                        mobsV[i].body.touching.left ||
                        mobsV[i].body.touching.right
                    ) {
                        if (el.moveV.change) {
                            el.state = "hpNone";
                            el.moveV.change = false;
                        }
                    }
                    if (
                        mobsV[i].body.blocked.up ||
                        mobsV[i].body.blocked.down ||
                        mobsV[i].body.blocked.left ||
                        mobsV[i].body.blocked.right
                    ) {
                        el.state = "hpNone";
                    }
                } else if (el.state == "wait") {
                    mobsV[i].anims.play(el.animation[1], true);
                    if (el.moveV.waitV == undefined) {
                        el.moveV.waitV = this.time.addEvent({
                            delay: el.moveV.wait,
                            callback: () => {
                                el.state = "run";
                            },
                            callbackScope: this,
                            loop: false,
                        });
                    }
                } else if (el.state == "hpNone") {
                    let directionX = Phaser.Math.Between(0, 1);
                    let directionY = Phaser.Math.Between(0, 1);
                    let distanceX = Phaser.Math.Between(100, 250);
                    let distanceY = Phaser.Math.Between(100, 250);
                    mobsV[i].anims.play(el.animation[0], true);
                    el.moveV = {
                        run: {},
                        wait: Phaser.Math.Between(3, 13) * 1000,
                        change: false,
                    };
                    if (directionX == 0) {
                        el.moveV.run.x = mobsV[i].x - distanceX;
                        mobsV[i].flipX = true;
                    } else if (directionX == 1) {
                        el.moveV.run.x = mobsV[i].x + distanceX;
                        mobsV[i].flipX = false;
                    }
                    if (directionY == 0) {
                        el.moveV.run.y = mobsV[i].y - distanceY;
                    } else if (directionY == 1) {
                        el.moveV.run.y = mobsV[i].y + distanceY;
                    }
                    el.state = "run";
                } else {
                    let directionX = Phaser.Math.Between(0, 1);
                    let directionY = Phaser.Math.Between(0, 1);
                    let distanceX = Phaser.Math.Between(100, 250);
                    let distanceY = Phaser.Math.Between(100, 250);
                    mobsV[i].setVelocity(0, 0);
                    mobsV[i].anims.play(el.animation[0], true);
                    el.moveV = {
                        run: {},
                        wait: Phaser.Math.Between(3, 13) * 1000,
                    };
                    if (directionX == 0) {
                        el.moveV.run.x = mobsV[i].x - distanceX;
                        mobsV[i].flipX = true;
                    } else if (directionX == 1) {
                        el.moveV.run.x = mobsV[i].x + distanceX;
                        mobsV[i].flipX = false;
                    }
                    if (directionY == 0) {
                        el.moveV.run.y = mobsV[i].y - distanceY;
                    } else if (directionY == 1) {
                        el.moveV.run.y = mobsV[i].y + distanceY;
                    }
                    el.state = "wait";
                }
            }
            if (el.health <= 0) {
                el.draw = "remove";
            }
        }
    },
};

//interface
const interfaceSC = {
    key: "interface",
    preload: function () {
        this.load.image("frame", "src/img/frame.png");
        this.load.image("frame_select", "src/img/frame_select.png");
        this.load.image("iron_pickaxe", "src/img/iron_pickaxe.png");
        this.load.image("iron_sword", "src/img/iron_sword.png");
        this.load.image("stone_pickaxe", "src/img/stone_pickaxe.png");
        this.load.image("stone_sword", "src/img/stone_sword.png");
        this.load.image("wood_pickaxe", "src/img/wood_pickaxe.png");
        this.load.image("wood_sword", "src/img/wood_sword.png");
    },
    updateBar: function (bar, now, max, y, color, x) {
        bar.clear();
        bar.fillStyle(color, 1);
        bar.fillRect(x, y, (now / max) * 300, 20);
        bar.lineStyle(1, 0x000000, 1);
        bar.strokeRect(x, y, 300, 20);
    },
    centerObjectsX: function (scene, objects, centerX, spacingX = 50) {
        const totalWidth = (objects.length - 1) * spacingX;
        const offsetX = -totalWidth / 2;
        objects.forEach((obj, index) => {
            obj.setX(centerX + offsetX + index * spacingX);
        });
    },
    create: function () {
        //overlay
        hpOverlay = this.add.graphics();
        hpOverlay.setScrollFactor(0);
        hpOverlay.setDepth(2);
        hpOverlay.fillStyle(0xff0000, 0);
        hpOverlay.fillRect(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height
        );
        stOverlay = this.add.graphics();
        stOverlay.setScrollFactor(0);
        stOverlay.setDepth(2);
        stOverlay.fillStyle(0xd3d3d3, 0);
        stOverlay.fillRect(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height
        );
        hgOverlay = this.add.graphics();
        hgOverlay.setScrollFactor(0);
        hgOverlay.setDepth(2);
        hgOverlay.fillStyle(0xffa500, 0);
        hgOverlay.fillRect(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height
        );
        //bar
        hpBar = this.add.graphics();
        textHp = this.add.text(10, 10, "Health", {
            font: "bold 18px Arial",
            fill: "#ffffff",
        });
        hpBar.setDepth(3);
        textHp.setDepth(4);
        stBar = this.add.graphics();
        textSt = this.add.text(10, 50, "Stamina", {
            font: "bold 18px Arial",
            fill: "#ffffff",
        });
        stBar.setDepth(3);
        textSt.setDepth(4);
        hgBar = this.add.graphics();
        textHg = this.add.text(350, 10, "Hunger", {
            font: "bold 18px Arial",
            fill: "#ffffff",
        });
        hgBar.setDepth(3);
        textHg.setDepth(4);
        armBar = this.add.graphics();
        textArm = this.add.text(350, 50, "Armor", {
            font: "bold 18px Arial",
            fill: "#ffffff",
        });
        armBar.setDepth(3);
        textArm.setDepth(4);
        //mobile management
        if (isMobile) {
            up = drawButton(120, 510, "up", 50)
                .on("pointerdown", () => {
                    intervalY = interfaceSCn.time.addEvent({
                        delay: 3,
                        callback: () => {
                            player.setVelocityY(-playerOj.speed);
                            isDownBt = true;
                        },
                        callbackScope: interfaceSCn,
                        loop: true,
                    });
                })
                .on("pointerout", () => {
                    player.setVelocityY(0);
                    intervalY.remove();
                    isDownBt = false;
                })
                .on("pointerup", () => {
                    player.setVelocityY(0);
                    intervalY.remove();
                    isDownBt = false;
                });
            down = drawButton(120, 630, "down", 50)
                .on("pointerdown", () => {
                    intervalY = interfaceSCn.time.addEvent({
                        delay: 3,
                        callback: () => {
                            player.setVelocityY(playerOj.speed);
                            isDownBt = true;
                        },
                        callbackScope: interfaceSCn,
                        loop: true,
                    });
                })
                .on("pointerout", () => {
                    player.setVelocityY(0);
                    intervalY.remove();
                    isDownBt = false;
                })
                .on("pointerup", () => {
                    player.setVelocityY(0);
                    intervalY.remove();
                    isDownBt = false;
                });
            left = drawButton(60, 570, "left", 50)
                .on("pointerdown", () => {
                    intervalX = interfaceSCn.time.addEvent({
                        delay: 5,
                        callback: () => {
                            player.setVelocityX(-playerOj.speed);
                            player.flipX = true;
                            isDownBt = true;
                        },
                        callbackScope: interfaceSCn,
                        loop: true,
                    });
                })
                .on("pointerout", () => {
                    player.setVelocityX(0);
                    intervalX.remove();
                    player.anims.play("turn");
                    isDownBt = false;
                })
                .on("pointerup", () => {
                    player.setVelocityX(0);
                    intervalX.remove();
                    isDownBt = false;
                });
            right = drawButton(180, 570, "right", 50)
                .on("pointerdown", () => {
                    intervalX = interfaceSCn.time.addEvent({
                        delay: 5,
                        callback: () => {
                            player.setVelocityX(playerOj.speed);
                            player.flipX = false;
                            isDownBt = true;
                        },
                        callbackScope: interfaceSCn,
                        loop: true,
                    });
                })
                .on("pointerout", () => {
                    player.setVelocityX(0);
                    intervalX.remove();
                    isDownBt = false;
                })
                .on("pointerup", () => {
                    player.setVelocityX(0);
                    intervalX.remove();
                    isDownBt = false;
                });
            shift = drawButton(1110, 510, "right", 50).on("pointerdown", () => {
                if (!sault && ISS2) {
                    sault = true;
                    playerOj.speed = playerOj.speed + 60;
                    playerOj.stamina = playerOj.stamina - 5;
                    player.anims.play("sault", true);
                    gameSCn.time.delayedCall(1300, () => {
                        sault = false;
                        playerOj.speed = playerOj.speed - 60;
                        player.anims.play("turn");
                        ISS2 = true;
                    });
                    ISS2 = false;
                }
            });
        }
        //inventory
        if (!isMobile) {
            this.input.on(
                "wheel",
                (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                    let nul = true;
                    if (deltaY < 0) {
                        for (
                            let ind = 0;
                            ind < playerOj.inventory.length;
                            ind++
                        ) {
                            let el = playerOj.inventory[ind];
                            if (el.select) {
                                nul = false;
                                IA1 = true;
                                playerOj.armor =
                                    playerOj.armor - Math.floor(el.damage / 2);
                                let nextIndex = ind + 1;
                                if (nextIndex < playerOj.inventory.length) {
                                    playerOj.inventory[nextIndex].select = true;
                                    el.select = false;
                                }
                                break;
                            }
                        }
                    } else if (deltaY > 0) {
                        for (
                            let ind = 0;
                            ind < playerOj.inventory.length;
                            ind++
                        ) {
                            let el = playerOj.inventory[ind];
                            if (el.select) {
                                nul = false;
                                IA1 = true;
                                playerOj.armor =
                                    playerOj.armor - Math.floor(el.damage / 2);
                                let prevIndex = ind - 1;
                                if (prevIndex >= 0) {
                                    playerOj.inventory[prevIndex].select = true;
                                    el.select = false;
                                }
                                break;
                            }
                        }
                    }
                    if (nul && playerOj.inventory[0]) {
                        playerOj.inventory[0].select = true;
                    }
                }
            );
        }
    },
    update: function () {
        //overlay
        const alpha2 = Phaser.Math.Clamp(1 - playerOj.stamina / 20, 0, 0.3);
        stOverlay.clear();
        stOverlay.fillStyle(0xd3d3d3, alpha2);
        stOverlay.fillRect(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height
        );
        const alpha3 = Phaser.Math.Clamp(1 - playerOj.hunger / 10, 0, 0.3);
        hgOverlay.clear();
        hgOverlay.fillStyle(0xffa500, alpha3);
        hgOverlay.fillRect(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height
        );
        const alpha = Phaser.Math.Clamp(1 - playerOj.health / 80, 0, 0.5);
        hpOverlay.clear();
        hpOverlay.fillStyle(0xff0000, alpha);
        hpOverlay.fillRect(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height
        );
        //update bar
        interfaceSC.updateBar(hpBar, playerOj.health, 100, 10, 0xff0000, 10);
        interfaceSC.updateBar(stBar, playerOj.stamina, 100, 50, 0x0077be, 10);
        interfaceSC.updateBar(hgBar, playerOj.hunger, 100, 10, 0xff8c00, 350);
        interfaceSC.updateBar(armBar, playerOj.armor, 100, 50, 0x808080, 350);
        //mobile management
        if (isMobile) {
            if (isDownBt) {
                if (!sault) {
                    player.anims.play("walk", true);
                }
                shakeX = Math.sin(gameSCn.time.now / 100) * 0.3;
                shakeY = Math.cos(gameSCn.time.now / 100) * 0.3;
                gameSCn.cameras.main.x += shakeX;
                gameSCn.cameras.main.y += shakeY;
                if (playerOj.stamina > 0) {
                    playerOj.stamina = playerOj.stamina - 0.05;
                }
            } else if (!isDownBt) {
                if (!sault) {
                    player.anims.play("turn");
                }
                shakeX = 0;
                shakeY = 0;
                gameSCn.cameras.main.x = shakeX;
                gameSCn.cameras.main.y = shakeY;
                if (playerOj.stamina < 100 && playerOj.hunger > 10) {
                    playerOj.stamina = playerOj.stamina + 0.3;
                    playerOj.hunger = playerOj.hunger - 0.002;
                }
            }
        }

        //antiChit
        if (playerOj.health > 100) {
            playerOj.health = 100;
        } else if (playerOj.health < 0) {
            playerOj.health = 0;
        }
        if (playerOj.stamina > 100) {
            playerOj.stamina = 100;
        } else if (playerOj.stamina < 0) {
            playerOj.stamina = 0;
        }
        if (playerOj.hunger > 100) {
            playerOj.hunger = 100;
        } else if (playerOj.hunger < 0) {
            playerOj.hunger = 0;
        }
        if (playerOj.armor > 100) {
            playerOj.armor = 100;
        } else if (playerOj.armor < 0) {
            playerOj.armor = 0;
        }
        if (playerOj.speed > 250) {
            playerOj.speed = 250;
        } else if (playerOj.speed < 35) {
            playerOj.speed = 35;
        }
        if (playerOj.soundness > 7) {
            playerOj.soundness = 7;
        } else if (playerOj.soundness < 2) {
            playerOj.soundness = 2;
        }

        //bar dependencies
        if (playerOj.stamina < 10) {
            if (CSS1) {
                playerOj.speed = playerOj.speed - 60;
                CSS1 = false;
                ISS1 = true;
            }
        } else if (playerOj.stamina > 10) {
            if (ISS1) {
                playerOj.speed = playerOj.speed + 60;
                ISS1 = false;
                CSS1 = true;
            }
        }
        if (playerOj.health < 100 && playerOj.hunger > 20) {
            playerOj.health = playerOj.health + 0.1;
            playerOj.hunger = playerOj.hunger - 0.01;
        }
        if (playerOj.hunger > 0) {
            let random = Phaser.Math.Between(1, playerOj.soundness);
            if (random == 1) {
                playerOj.hunger = playerOj.hunger - 0.002;
            }
        } else if (playerOj.health > 0) {
            playerOj.health = playerOj.health - 0.05;
        }

        //inventory
        for (let i = playerOj.inventory.length - 1; i >= 0; i--) {
            let el = playerOj.inventory[i];

            if (el.draw == true) {
                if (el.select) {
                    playerOj.framesV[i].setTexture("frame_select");
                } else {
                    playerOj.framesV[i].setTexture("frame");
                }
            }

            if (el.draw == false) {
                playerOj.framesV[i] = interfaceSCn.add.image(0, 660, "frame");
                playerOj.framesV[i].setDisplaySize(50, 50);
                playerOj.framesV[i].setDepth(3);
                playerOj.framesV[i].setInteractive().on("pointerdown", () => {
                    playerOj.inventory.forEach((elem) => {
                        if (elem.select) {
                            IA1 = true;
                            playerOj.armor =
                                playerOj.armor - Math.floor(elem.damage / 2);
                        }
                    });
                    for (
                        let indx = 0;
                        indx < playerOj.inventory.length;
                        indx++
                    ) {
                        playerOj.inventory[indx].select = false;
                    }
                    el.select = true;
                });
                playerOj.subjectV[i] = interfaceSCn.add.image(0, 660, el.srcLG);
                playerOj.subjectV[i].setDisplaySize(50, 50);
                playerOj.subjectV[i].setDepth(4);
                el.draw = true;
                interfaceSC.centerObjectsX(
                    interfaceSCn,
                    playerOj.framesV,
                    interfaceSCn.cameras.main.width / 2,
                    60
                );
                interfaceSC.centerObjectsX(
                    interfaceSCn,
                    playerOj.subjectV,
                    interfaceSCn.cameras.main.width / 2,
                    60
                );
            } else if (el.draw == "remove") {
                playerOj.framesV[i].destroy();
                playerOj.framesV.splice(i, 1);
                playerOj.subjectV[i].destroy();
                playerOj.subjectV.splice(i, 1);
                playerOj.inventory.splice(i, 1);
                interfaceSC.centerObjectsX(
                    interfaceSCn,
                    playerOj.framesV,
                    interfaceSCn.cameras.main.width / 2,
                    60
                );
                interfaceSC.centerObjectsX(
                    interfaceSCn,
                    playerOj.subjectV,
                    interfaceSCn.cameras.main.width / 2,
                    60
                );
            }
            if (el.broken < 0) {
                el.draw = "remove";
            }
            if (el.select && IA1) {
                interfaceSCn.input.setDefaultCursor(
                    "url(src/img/" + el.cursor + ".png), auto"
                );
                playerOj.armor = playerOj.armor + Math.floor(el.damage / 2);
                IA1 = false;
            }
        }
        if (playerOj.inventory.length == 0) {
            interfaceSCn.input.setDefaultCursor(
                "url(src/img/cursor.png), auto"
            );
        }
    },
};

//scene
const sceneAR = [gameSC, interfaceSC];

//config and game
const config = {
    type: Phaser.AUTO,
    parent: "game_div",
    width: 1280,
    height: 720,
    pixelArt: true,
    scene: sceneAR,
    backgroundColor: "transparent",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0,
                x: 0,
            },
            debug: true,
        },
    },
    input: {
        mouse: true,
        touch: true,
        keyboard: true,
    },
};

const game = new Phaser.Game(config);
