import {defs, tiny} from './examples/common.js';
import {Shape_From_File} from "./examples/obj-file-demo.js"; //Will prob need this for creating characters
import { Text_Line } from "./examples/text-demo.js"; //Needed for adding text


const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Textured_Phong} = defs


export class Assignment3 extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            circle: new defs.Regular_2D_Polygon(1, 15),
            // TODO:  CREATE SHAPES FOR THE OBJECTS (see examples from assignment 3 below)

            // Baristas:
            miffy: new Shape_From_File("./assets/smaller3ObjectsMiffyMinusEyes.obj"),
            miffyFace: new Shape_From_File("./assets/miffyEyesAndMouth.obj"),
            capyBody: new Shape_From_File("./assets/capyBody.obj"),
            capyFace: new Shape_From_File("./assets/capyEyesNose.obj"),
            capySnot: new Shape_From_File("./assets/capySnot.obj"),

            //objects
            cup: new Shape_From_File("./assets/cafeCup.obj"),
            cafe: new Shape_From_File("./assets/cafeSetting.obj"),
            star: new Shape_From_File("./assets/star.obj"),
            specialStar: new Shape_From_File("./assets/specialStar.obj"),
            moon: new Shape_From_File("./assets/tableMoon.obj"),
            cloudCounter: new Shape_From_File("./assets/cloudCounter.obj"),
            wallsAndFloor: new Shape_From_File("./assets/wallsAndFloor.obj"),
            sky: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(4),
            text: new Text_Line(50),
            drink: new defs.Regular_2D_Polygon(1, 15),
            cafeSign: new Shape_From_File("./assets/lunarCafe.obj"),

        };

        // *** Materials
        this.materials = {
            // CAFE OBJECTS
            miffy: new Material(new defs.Phong_Shader(), {
                ambient: 0.67,
                diffusivity: 0.5,
                specularity: 0.05,  // lower spec = more matte, higher = more glassy
                color: hex_color("#FFFFFF")
            }),
            miffyFace: new Material(new defs.Phong_Shader(), {
                ambient: 0.67,
                diffusivity: 0.11,
                specularity: 3,
                color: hex_color("#2E2F2F")
            }),
            capyBody: new Material(new defs.Phong_Shader(), {
                ambient: 0.67,
                diffusivity: 0.5,
                specularity: 0.05,  // lower spec = more matte, higher = more glassy
                color: hex_color("#66442a")
            }),
            capyFace: new Material(new defs.Phong_Shader(), {
                ambient: 0.67,
                diffusivity: 0.11,
                specularity: 3,
                color: hex_color("#2E2F2F")
            }),
            capySnot: new Material(new defs.Phong_Shader(), {
                ambient: 0.67,
                diffusivity: 1,
                specularity: 10,
                color: hex_color("#81b4eb")
            }),
            cup: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                diffusivity: 0.1,
                color: hex_color("#3b1327")
                //bfb891
            }),
            cafe: new Material(new defs.Phong_Shader(), {
                ambient: 0.6,
                diffusivity: 1,
                color: hex_color("#898aa3"),
                specularity: 0.1,
                //texture: new Texture("./assets/Textures/woolTexture.png")
            }),
            star: new Material(new Gouraud_Shader(100), {
                ambient: 0.9,
                diffusivity: 0.001, //this is shiny, use 0.1 for smooth clay look
                specularity: 5,
                color: hex_color("#FBF2C0")
            }),
            specialStar: new Material(new Gouraud_Shader(100), {
                ambient: 0.9,
                diffusivity: 0.001, //this is shiny, use 0.1 for smooth clay look
                specularity: 50,
                color: hex_color("#FBF2C0"),
            }),
            moon: new Material(new Gouraud_Shader(100), {
                ambient: 0.9,
                diffusivity: 0.001, //this is shiny, use 0.1 for smooth clay look
                specularity: 50,
                color: hex_color("#FFE066")
            }),
            cloudCounter: new Material(new Gouraud_Shader(100), {
                ambient: 0.9,
                diffusivity: 0.001, //this is shiny, use 0.1 for smooth clay look
                specularity: 50,
                color: hex_color("#EAEAEA")
            }),
            wallsAndFloor: new Material(new defs.Phong_Shader(), {
                ambient: 0.6,
                // diffusivity: 1,
                color: hex_color("#898aa3"),
                // specularity: 0.1,
                //texture: new Texture("assets/87.jpg")
            }),
            sky: new Material(new defs.Phong_Shader(), {
                ambient: 0.9,
                diffusivity: 0.1,
                specularity: 0,
                color: hex_color("#2E2F2F"),
            }),
            text: new Material(new defs.Textured_Phong(), {
                ambient: 1,
                color: hex_color("#000000"),
                texture: new Texture("assets/text.png"),
            }),
            greenTea: new Material(new defs.Textured_Phong(), {
                ambient: 1,
                texture: new Texture("assets/removedTea2.png"),
            }),
            Latte: new Material(new defs.Textured_Phong(), {
                ambient: 1,
                texture: new Texture("assets/latte.png"),
            }),
            Espresso: new Material(new defs.Textured_Phong(), {
                ambient: 1,
                texture: new Texture("assets/espresso.png"),
            }),
        }


        //set up initial POV
        this.initial_camera_location = Mat4.look_at(vec3( 17, 0.25, 40 ), vec3( 0,1,0 ), vec3( 0,6,0 ));

        //set up drink making animation flag
        this.makeDrink = false;
        this.drink_choice = "";
        this.magic_sound = false;
        this.starMaxSize = false;

        //set up static background stars
        this.starPositionsInitialized = false;
        this.starPositionsBack = [];
        this.starPositionsFront = [];
        this.starPositionsLeft = [];
        this.starPositionsRight = [];

        //chosen barista
        this.barista = "miffy";

        //Messages
        this.openingMessage = "Greet Baristas [x]"
        this.welcomeMessage = "Welcome To Lunar Cafe! [x]";
        this.baristaQuestion = "Which Barista can assist you?";
        this.baristaOptionMiffy = "Miffy [M]";
        this.baristaOptionCapy = "Capy [C]";
        this.selectedMiffyMessage = "You Chose Miffy! [x]";
        this.selectedCapyMessage = "You Chose Capy! [x]";
        this.miffyIntroductionMessage = "Greetings! I'm Miffy!";
        this.capyIntroductionMessage = "Salutations, student! My name is Capy!";
        this.drinkChoicesMessage = "Please Choose A Drink To Read About!";
        this.drinkOptionGreenTea = "Green tea [G]";
        this.drinkOptionEspresso = "Espresso [E]";
        this.drinkOptionLatte = "Latte [L]";
        this.greenTeaDescription = "Green Tea gives you wisdom!";
        this.espressoDescription1 = "Espresso sharpens your mind!";
        this.espressoDescription2 = "Ready to ace an exam without fatigue?";
        this.latteDescription = "Latte gives you vitality!";
        this.confirmDrinkChoiceMessage = "Choose this drink [x]";
        this.backToDrinkChoicesMessage = "Choose another drink [B]";
        this.paymentMessage1 = "One star is needed to brew!";
        this.paymentMessage2 = "Collect the star once it has grown! [x]";
        this.choseGreenTea = "Green tea coming right up! [x]";
        this.choseLatte = "Latte coming right up! [x]";
        this.choseEspresso = "Espresso coming right up! [x]";
        this.tryAgain = "Please choose another option";
        this.grabStarMessage = "Claim star [S]";
        this.giveStarMessage = "Give star to barista [x]";
        this.drinkFinishedMessage1 = "Your order is complete!";
        this.drinkFinishedMessage2 = "Inspect your drink! [i]";
        this.brew = "Brew drink! [x]";

        //Message flags
        this.showOpeningMessage = true;
        this.showWelcomeMessage = false;
        this.showBaristaQuestion = false;
        this.showSelectedMiffyMessage = false;
        this.showSelectedCapyMessage = false;
        this.showMiffyIntroductionMessage = false;
        this.showCapyIntroductionMessage = false;
        this.showDrinkChoicesMessage = false;
        this.showGreenTeaDescription = false;
        this.showEspressoDescription = false;
        this.showLatteDescription = false;
        this.showPaymentMessage = false;
        this.showLatteSelection = false;
        this.showEspressoSelection = false;
        this.showGreenTeaSelection = false;
        this.showTryAgain = false;
        this.showGrabStarMessage = false;
        this.showGiveStarMessage = false;
        this.showDrinkFinishedMessage = false;
        this.showBrew = false;


        //Needed to display messages letter by letter (one variable needed for each line present per screen)
        this.messageIndex = 0;
        this.messageIndex2 = 0;
        this.messageIndex3 = 0;
        this.messageIndex4 = 0;
        this.messageIndex5 = 0;

        //Needed for the star animation
        this.showStarGrowing = false;
        this.showStar = true;
        this.lockStar = false;

        //Needed for barista animations
        this.showMiffyJumping = false;
        this.showCapyJumping = false;
        this.capyJumpCtr = 0;
        this.miffyJumpCtr = 0;

        //bgm
        this.bgm_playing = false;

    }

    playsound(barista, sec) {
        let mSpeak1 = new Audio("./assets/isabelle_one_sec.mp3");
        let mSpeak2 = new Audio("./assets/isabelle_onehalf_sec.mp3");
        let mSpeak3 = new Audio("./assets/isabelle_two_sec.mp3");
        let mSpeak4 = new Audio("./assets/isabelle_two.mp3");

        let cSpeak1 = new Audio("./assets/tn_short.mp3");
        let cSpeak2 = new Audio("./assets/tn_shortest.mp3");
        let cSpeak3 = new Audio("./assets/tn_longer2.mp3");
        let cSpeak4 = new Audio("./assets/tn_short3.mp3");

        let cupView = new Audio("./assets/inspect.mp3");
        let magic = new Audio("./assets/magic_less_delay.mp3");

        let bgm = new Audio("./assets/bgmQuieter.mp3");

        if(!this.bgm_playing && (barista === "bgm") && (sec === 99))
        {
            bgm.play();
        }

        if (barista === "miffy")
        {
            if (sec === 1) {
                mSpeak1.play();
            }
            else if (sec === 2) {
                mSpeak2.play();
            }
            else if (sec === 3) {
                mSpeak3.play();
            }
            else if (sec === 4) {
                mSpeak4.play();
            }
        }
        else if (barista === "capy") {
            if (sec === 1) {
                cSpeak1.play();
            }
            else if (sec === 2) {
                cSpeak2.play();
            }
            else if (sec === 3) {
                cSpeak3.play();
            }
            else if (sec === 4) {
                cSpeak4.play();
            }
        }
        else {
            if (barista === "inspect") {
                cupView.play();
            }
            else if (barista === "magic") {
                magic.play();
            }

        }

    }

    make_control_panel() {
        //HAVE NOT YET SET UP PERSPECTIVE CHANGES
        this.key_triggered_button("Inspect Drink/Exit Inspect", ["i"], () => {
            if (this.attached() !== this.drink) {
                this.attached = () => this.drink;
                this.playsound("inspect", 1)
            }
            else {
                this.attached = () => this.cloudCounter;
                this.playsound("inspect", 1)
            }


        });
        this.new_line();
        this.key_triggered_button("Next Message/Reset View", ["x"], () => {
            //set up view for when interacting with employees

            if(!this.bgm_playing) {
                this.playsound("bgm", 99);
                this.bgm_playing = true;
            }
            if(this.showOpeningMessage) {
                this.attached = () => this.cloudCounter;

                this.showOpeningMessage = false;
                this.showWelcomeMessage = true;
                this.messageIndex = 0;
                this.showTryAgain = false;

                this.playsound(this.barista, 1);

                //We can have some boolean to lock the users screen so they have to look at both baristas

            } else if (this.showWelcomeMessage) {
                this.showWelcomeMessage = false;
                this.showBaristaQuestion = true;
                this.messageIndex = 0;
                this.playsound(this.barista, 2);

            } else if (this.showSelectedMiffyMessage) {
                this.showSelectedMiffyMessage = false;
                this.showMiffyIntroductionMessage = true;
                this.showDrinkChoicesMessage = true;
                this.messageIndex = 0;
                this.barista = "miffy";
                this.playsound("miffy", 3);

            } else if (this.showSelectedCapyMessage) {
                this.showSelectedCapyMessage = false;
                this.showCapyIntroductionMessage = true;
                this.showDrinkChoicesMessage = true;
                this.messageIndex = 0;
                this.barista = "capy";
                this.playsound("capy", 3);

            } else if (this.showGreenTeaDescription) {
                this.showGreenTeaDescription = false;
                //this.showGreenTeaSelection = true; //set up for the selection message
                this.showPaymentMessage = true;
                this.drink_choice = "greenTea"; //set up for when we want to draw the selected drink

                this.playsound(this.barista, 2);

                //Implement logic / booleans to here show drink being created
                //we can make use of the this.baristaIsMiffy or this.baristaIsCapy for animations

                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;
                this.messageIndex4 = 0;
                this.messageIndex5 = 0;

            } else if (this.showEspressoDescription) {
                this.showEspressoDescription = false;
                //this.showEspressoSelection = true; //set up for the selection message
                this.showPaymentMessage = true;
                this.drink_choice = "Espresso"; //set up for when we want to draw the selected drink
                //this.makeDrink = true;

                this.playsound(this.barista, 2);


                //Implement logic / booleans to here show drink being created
                //we can make use of the this.baristaIsMiffy or this.baristaIsCapy for animations

                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;
                this.messageIndex4 = 0;
                this.messageIndex5 = 0;

            } else if (this.showLatteDescription) {
                this.showLatteDescription = false;
                //this.showLatteSelection = true; //set up for the selection message
                this.showPaymentMessage = true;
                this.drink_choice = "Latte"; //set up for when we want to draw the selected drink
                //this.makeDrink = true;

                this.playsound(this.barista, 2);

                //Implement logic / booleans to here show drink being created
                //we can make use of the this.baristaIsMiffy or this.baristaIsCapy for animations

                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;
                this.messageIndex4 = 0;
                this.messageIndex5 = 0;

            }
            else if (this.showPaymentMessage){
                this.attached = () => this.centralStar;

                this.showPaymentMessage = false;

                this.showStarGrowing = true;

                this.messageIndex = 0;
                this.messageIndex2 = 0;

                this.playsound("magic", 3);

            }
            else if (this.showTryAgain) {
                this.tryAgain = false;

                this.playsound(this.barista, 1);

                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;
                this.messageIndex4 = 0;
                this.messageIndex5 = 0;
            }
            else if (this.showGiveStarMessage){
                this.showGiveStarMessage = false;

                if(this.drink_choice === "greenTea"){
                    this.showGreenTeaSelection = true;
                } else if (this.drink_choice === "Espresso"){
                    this.showEspressoSelection = true;
                } else if (this.drink_choice === "Latte"){
                    this.showLatteSelection = true;
                }

                if(this.barista === "capy"){
                    this.showCapyJumping = true;
                } else if(this.barista === "miffy"){
                    this.showMiffyJumping = true;
                }

                this.messageIndex = 0;
                this.messageIndex2 = 0;

                this.playsound(this.barista, 2);

                //this.makeDrink = true;
            }
            else if (this.showGreenTeaSelection || this.showEspressoSelection || this.showLatteSelection){
                this.showGreenTeaSelection = this.showEspressoSelection = this.showLatteSelection = false;

                this.showMiffyJumping = this.showCapyJumping = false;

                this.showDrinkFinishedMessage = true;

                this.makeDrink = true;

                this.messageIndex = 0;
                this.messageIndex2 = 0;

                this.playsound(this.barista, 2);

            }
        });
        this.key_triggered_button("Choose Miffy", ["Shift", "M"], () => {
            if(this.showBaristaQuestion) {
                this.showBaristaQuestion = false;
                this.showSelectedMiffyMessage = true;
                this.baristaIsMiffy = true;
                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;

                //We can put a boolean here to lock the users screen, will only Miffy in the FOV (Remove Capy from display)
            }
        });
        this.key_triggered_button("Choose Capy", ["Shift", "C"], () => {
            if(this.showBaristaQuestion) {
                this.showBaristaQuestion = false;
                this.showSelectedCapyMessage = true;
                this.baristaIsCapy = true;
                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;

                //We can put a boolean here to lock the users screen, will only Capy in the FOV (Remove Miffy from FOV)
            }
        });

        //AFTER A CHOICE BEING MADE, MAGIC SOUND WILL PLAY AFTER A DELAY
        this.key_triggered_button("Choose Green Tea", ["Shift", "G"], () => {
            if(this.showDrinkChoicesMessage) {
                this.showDrinkChoicesMessage = false;
                this.showGreenTeaDescription = true;
                this.playsound(this.barista, 2);

                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;
                this.messageIndex4 = 0;
                this.messageIndex5 = 0;
            }
        });
        this.key_triggered_button("Choose Espresso", ["Shift", "E"], () => {
            if(this.showDrinkChoicesMessage) {

                this.playsound(this.barista, 4);

                this.showDrinkChoicesMessage = false;
                this.showEspressoDescription = true;
                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;
                this.messageIndex4 = 0;
                this.messageIndex5 = 0;
            }
        });
        this.key_triggered_button("Choose Latte", ["Shift", "L"], () => {
            if(this.showDrinkChoicesMessage) {
                this.showDrinkChoicesMessage = false;
                this.showLatteDescription = true;

                this.playsound(this.barista, 2);

                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;
                this.messageIndex4 = 0;
                this.messageIndex5 = 0;
            }
        });
        this.key_triggered_button("Back To Drinks", ["Shift", "B"], () => {
            if((this.showGreenTeaDescription || this.showEspressoDescription || this.latteDescription) && (!this.showDrinkFinishedMessage)) {
                this.playsound(this.barista, 3);

                this.showGreenTeaDescription = this.showEspressoDescription = this.showLatteDescription = false;
                this.showMiffyIntroductionMessage = this.showCapyIntroductionMessage = false;
                this.showDrinkChoicesMessage = true;
                this.showGreenTeaSelection = this.showLatteSelection = this.showEspressoSelection = false;
                this.showTryAgain = false;
                this.showOpeningMessage = this.showWelcomeMessage = false;
                this.messageIndex = 0;
                this.messageIndex2 = 0;
                this.messageIndex3 = 0;
                this.messageIndex4 = 0;
                this.messageIndex5 = 0;
            }

            this.attached = () => this.cloudCounter;

        });
        this.key_triggered_button("Claim Star", ["Shift", "S"], () => {
            if(this.showGrabStarMessage) {
                //this.playsound(this.barista, 3);

                this.showGrabStarMessage = false;
                this.showStarGrowing = false;
                this.showStar = false;

                this.messageIndex = 0;
                this.messageIndex2 = 0;

                this.attached = () => this.cloudCounter;

                this.showGiveStarMessage = true;
            }


        });
    }

    //draw selected object chosen by objKey, customize the lighting and the coloring of the object before drawing it
    display_obj(context, program_state, model_transform, objKey){

        // basic parameters
        let obj_color = this.materials[objKey].color;

        //change light and color settings based on the object to display
        if (objKey === "star")
        {
            let obj_light_atten = 10000000000000000000000;
            let obj_light_pos = vec4(20,20,30,1);
        }
        //draw object
        this.shapes[objKey].draw(context, program_state, model_transform, this.materials[objKey]);

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);
    }

    drawStars(context, program_state, star_pos) {
        // Create an array for star positions
        if (!this.starPositionsInitialized) {
            this.starPositionsBack = new Array(60).fill(null);
            this.starPositionsFront = new Array(30).fill(null);
            this.starPositionsLeft = new Array(60).fill(null);
            this.starPositionsRight= new Array(60).fill(null);

            for (let i = 0; i < this.starPositionsBack.length; i++) {
                const minCeiledY = 100;
                const maxFlooredY = -200;
                const minCeiled = -300;
                const maxFloored = 20;
                let randomX = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
                let randomY = Math.floor(Math.random() * (maxFlooredY - minCeiledY) + minCeiledY) + 100;
                let randomZ = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);

                // Create a transformation matrix for the current star
                this.starPositionsBack[i] = star_pos.times(Mat4.translation(randomX, randomY, randomZ));
            }

            for (let i = 0; i < this.starPositionsFront.length; i++) {
                const minCeiledYF = 100;
                const maxFlooredYF = -200;
                const minCeiledF = 200;
                const maxFlooredF = 20;
                let randomXF = Math.floor(Math.random() * (maxFlooredF - minCeiledF -150) + minCeiledF+150);
                let randomYF = Math.floor(Math.random() * (maxFlooredYF - minCeiledYF) + minCeiledYF);
                let randomZF = Math.floor(Math.random() * (maxFlooredF - minCeiledF) + minCeiledF);

                // Create a transformation matrix for the current star
                this.starPositionsFront[i] = star_pos.times(Mat4.translation(randomXF, randomYF, randomZF));
            }

            for (let i = 0; i < this.starPositionsLeft.length; i++) {
                const minCeiledYL = 100;
                const maxFlooredYL = -200;
                const minCeiledL = 200;
                const maxFlooredL = 20;
                let randomXL = Math.floor(Math.random() * (maxFlooredYL - minCeiledYL) + minCeiledYL);
                let randomYL = Math.floor(Math.random() * (maxFlooredYL - minCeiledYL - 20) + minCeiledYL);
                let randomZL = Math.floor(Math.random() * (maxFlooredL - minCeiledL-40) + minCeiledL+40);

                // Create a transformation matrix for the current star
                this.starPositionsLeft[i] = star_pos.times(Mat4.translation(randomXL, randomYL, randomZL));
            }

            for (let i = 0; i < this.starPositionsRight.length; i++) {
                const minCeiledYR = 200;
                const maxFlooredYR = -100;
                const minCeiledR = -300;
                const maxFlooredR = -20;
                let randomXR = Math.floor(Math.random() * (maxFlooredYR - minCeiledYR) + minCeiledYR);
                let randomYR = Math.floor(Math.random() * (maxFlooredYR - minCeiledYR - 20) + minCeiledYR);
                let randomZR = Math.floor(Math.random() * (maxFlooredR - minCeiledR +60) + minCeiledR-60);

                // Create a transformation matrix for the current star
                this.starPositionsRight[i] = star_pos.times(Mat4.translation(randomXR, randomYR, randomZR));
            }

            this.starPositionsInitialized = true;
        }
        else {
            this.starPositionsBack.forEach(transform => {
                this.display_obj(context, program_state, transform, "star");
            });
            this.starPositionsFront.forEach(transform => {
                this.display_obj(context, program_state, transform, "star");
            });
            this.starPositionsLeft.forEach(transform => {
                this.display_obj(context, program_state, transform, "star");
            });
            this.starPositionsRight.forEach(transform => {
                this.display_obj(context, program_state, transform, "star");
            });
        }
    }

    drawCapy(context, program_state, capy_elems_pos){
        let capy_body_trans = capy_elems_pos;
        capy_body_trans = capy_body_trans.times(Mat4.scale(1.25,1.5,1.5));

        let capy_face_trans = capy_elems_pos;
        capy_face_trans = capy_face_trans.times(Mat4.scale(.4,.5,.60)).times(Mat4.translation(5.4, 1, 0.04));

        let capy_snot_trans = capy_elems_pos;
        capy_snot_trans = capy_snot_trans.times(Mat4.scale(.2,.2,.2)).times(Mat4.translation(12,0,-1));

        this.display_obj(context, program_state, capy_body_trans, "capyBody");
        this.display_obj(context, program_state, capy_face_trans, "capyFace");
        this.display_obj(context, program_state, capy_snot_trans, "capySnot");
    }

    drawMiffy(context, program_state, miffy_base) {
        let miffy_face_pos = miffy_base;
        miffy_face_pos = miffy_face_pos.times(Mat4.translation(2.5, 3, -2.5)).times(Mat4.scale(.3,.3,.3))
            .times(Mat4.translation(-8.5,-9.1,10.69));
        this.display_obj(context, program_state, miffy_base, "miffy");
        this.display_obj(context, program_state, miffy_face_pos, "miffyFace");
    }
    display(context, program_state) {
        let t = program_state.animation_time / 1000;
        let t_delay = t;
        t_delay = t_delay + 3;

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        let talking_offset_and_rotation = Mat4.rotation(0.5, 0, 1, 0).times(Mat4.translation(3,1.4,15));
        let starBrewing_offset_and_rotation = Mat4.rotation(Math.PI / 2, 0, 1, 0).times(Mat4.translation(-2,1.5,5));
        let talking_to_Miffy_transform = Mat4.rotation(0.5, 0, 1, 0).times(Mat4.translation(3,1.4,8));
        let talking_to_Capy_transform = Mat4.rotation(0.5, 0, 1, 0).times(Mat4.translation(5,1.4,8));

        // this.playsound("bgm", 99);
        //
        // if (!this.bgm_playing) {
        //     this.playsound("bgm", 99);
        //     this.bgm_playing = true;
        // }


        //set up basic overhead light
        program_state.lights = [new Light(vec4(50,600,250,1), hex_color("#f3d9fc"), 65000000)];
        let model_transform = Mat4.identity();

        //Draw Background
        let background_transform = model_transform;
        let moon_transform = model_transform;
        let cloudCounter_transform = model_transform;
        let wallsAndFloor_transform = model_transform;

        background_transform = background_transform.times(Mat4.rotation(180,0,1 , 0)).times(Mat4.translation(0,0.7,0)).times(Mat4.scale(7,7,7));
        moon_transform = moon_transform.times(Mat4.rotation(180,0,1 , 0)).times(Mat4.translation(2.8,0.5,-2.5)).times(Mat4.scale(2,2,2));
        cloudCounter_transform = cloudCounter_transform.times(Mat4.rotation(180,0,1 , 0)).times(Mat4.translation(0,-1.2,-2)).times(Mat4.scale(2.5,2.5,2.5));
        wallsAndFloor_transform = wallsAndFloor_transform.times(Mat4.rotation(180,0,1 , 0)).times(Mat4.translation(-3,1.8,5)).times(Mat4.scale(16,12.5,12.5));

        this.cloudCounter = Mat4.inverse(talking_offset_and_rotation);
        this.centralStar = Mat4.inverse(starBrewing_offset_and_rotation);
        this.talkingToMiffy = Mat4.inverse(talking_to_Miffy_transform);
        this.talkingToCapy = Mat4.inverse(talking_to_Capy_transform);

        this.display_obj(context, program_state, moon_transform, "moon");
        this.display_obj(context, program_state, cloudCounter_transform, "cloudCounter");
        this.shapes.wallsAndFloor.draw(context, program_state, wallsAndFloor_transform, this.materials.wallsAndFloor);


        //Draw Night Sky
        let sky_placement = model_transform;
        sky_placement = sky_placement.times(Mat4.translation(80,0, -200)).times(Mat4.scale(400,400,400));
        this.display_obj(context, program_state, sky_placement, "sky");

        //Draw Miffy
        let miffy_base_transform = model_transform;
        //TO CHANGE MIFFY'S LCOATION CHANGE miffy_base_transform AND ALL PIECES WILL MOVE TOGETHER
        miffy_base_transform = miffy_base_transform
            .times(Mat4.rotation(0.3, 0, 1,0))
            .times(Mat4.scale(1.5,1.5,1.5))
            .times(Mat4.translation(2.2,0.5,-1.5));

        let miffy_height = 0.3 * Math.sin(25 * t);

        if(this.showMiffyJumping && this.miffyJumpCtr < 8){

            if (miffy_height >= 0.29) { // Use a small tolerance for approximate equality
                this.miffyJumpCtr++;
            }

            miffy_base_transform = miffy_base_transform.times(Mat4.translation(0, miffy_height, 0));

        }

        this.drawMiffy(context, program_state, miffy_base_transform);

        //Draw Capy
        let capy_base_pos = model_transform;

        //TO CHANGE CAPY'S LOCATION, EDIT CAPY_BASE_POS AND ALL OF HIS PIECES WILL MOVE TOGETHER
        capy_base_pos = capy_base_pos.times(Mat4.rotation(5, 0, 1, 0)).times(Mat4.translation(-2,-1,-7));

        let capy_height = 0.3 * Math.sin(25 * t);

        if(this.showCapyJumping && this.capyJumpCtr < 8){

            if (capy_height >= 0.29) { // Use a small tolerance for approximate equality
                this.capyJumpCtr++;
            }

            capy_base_pos = capy_base_pos.times(Mat4.translation(0, capy_height, 0));

        }

        this.drawCapy(context, program_state, capy_base_pos);
        
        //Draw Cup
        let cup_transform = model_transform;
        cup_transform = cup_transform.times(Mat4.scale(0.5, 0.5, 0.5)).times(Mat4.translation(7, 0, -3));
        this.display_obj(context, program_state, cup_transform, "cup");
        let cup_view = cup_transform;
        cup_view = cup_view.times(Mat4.translation(0,4,0)).times(Mat4.rotation(35.5, .8, 1, 0.99));
        this.drink = Mat4.inverse(cup_view);

        //Opening message
        if(this.showOpeningMessage){
            let opening_transform = Mat4.identity().times(Mat4.translation(3, 5, 0)).times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25));

            if (this.messageIndex < this.openingMessage.length) {
                this.shapes.text.set_string(this.openingMessage.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, opening_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.openingMessage, context.context);
                this.shapes.text.draw(context, program_state, opening_transform, this.materials.text);
            }

        }

        //Welcome message
        if(this.showWelcomeMessage){
            let welcome_transform = Mat4.identity().times(Mat4.translation(3, 5, 0)).times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25));

            if (this.messageIndex < this.welcomeMessage.length) {
                    this.shapes.text.set_string(this.welcomeMessage.substring(0, this.messageIndex + 1), context.context);
                    this.shapes.text.draw(context, program_state, welcome_transform, this.materials.text);
                    this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.welcomeMessage, context.context);
                this.shapes.text.draw(context, program_state, welcome_transform, this.materials.text);
            }

        }

        //Barista Question and Options
        if(this.showBaristaQuestion){
            let baristaQuestion_transform = Mat4.identity().times(Mat4.translation(2, 5, 0)).times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25));
            let baristaOptionMiffy_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(10, 18, 0));
            let baristaOptionCapy_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(24, 6.5, 0));

            let firstLineDone = false;
            let secondLineDone = false;

            if (this.messageIndex < this.baristaQuestion.length) {
                this.shapes.text.set_string(this.baristaQuestion.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, baristaQuestion_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.baristaQuestion, context.context);
                this.shapes.text.draw(context, program_state, baristaQuestion_transform, this.materials.text);
                firstLineDone = true;
            }

            if (this.messageIndex2 < this.baristaOptionMiffy.length && firstLineDone) {
                this.shapes.text.set_string(this.baristaOptionMiffy.substring(0, this.messageIndex2 + 1), context.context);
                this.shapes.text.draw(context, program_state, baristaOptionMiffy_transform, this.materials.text);
                this.messageIndex2++;
            } else if (firstLineDone) {
                this.shapes.text.set_string(this.baristaOptionMiffy, context.context);
                this.shapes.text.draw(context, program_state, baristaOptionMiffy_transform, this.materials.text);
                secondLineDone = true;
            }

            if (this.messageIndex3 < this.baristaOptionCapy.length && secondLineDone) {
                this.shapes.text.set_string(this.baristaOptionCapy.substring(0, this.messageIndex3 + 1), context.context);
                this.shapes.text.draw(context, program_state, baristaOptionCapy_transform, this.materials.text);
                this.messageIndex3++;
            } else if (secondLineDone) {
                this.shapes.text.set_string(this.baristaOptionCapy, context.context);
                this.shapes.text.draw(context, program_state, baristaOptionCapy_transform, this.materials.text);
            }

        }

        //User chooses Miffy to be Barista
        if(this.showSelectedMiffyMessage){
            let selectedMiffy_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 18, 0));

            if (this.messageIndex < this.selectedMiffyMessage.length) {
                this.shapes.text.set_string(this.selectedMiffyMessage.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, selectedMiffy_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.selectedMiffyMessage, context.context);
                this.shapes.text.draw(context, program_state, selectedMiffy_transform, this.materials.text);
            }

        }

        //User chooses Capy to be Barista
        if(this.showSelectedCapyMessage){
            let selectedCapy_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 16, 0));

            if (this.messageIndex < this.selectedCapyMessage.length) {
                this.shapes.text.set_string(this.selectedCapyMessage.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, selectedCapy_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.selectedCapyMessage, context.context);
                this.shapes.text.draw(context, program_state, selectedCapy_transform, this.materials.text);
            }

        }

        //Show drink options
        if(this.showDrinkChoicesMessage){

            let introduction_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 22, 0));
            let drinkChoices_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 19, 0));
            let greenTea_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(23.5, 13, 0));
            let espresso_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(23.5, 10, 0));
            let latte_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(23.5, 7 , 0));

            let firstLineDone = false;
            let secondLineDone = false;
            let thirdLineDone = false;
            let fourthLineDone = false;

            if(this.showMiffyIntroductionMessage){
                if (this.messageIndex < this.miffyIntroductionMessage.length) {
                    this.shapes.text.set_string(this.miffyIntroductionMessage.substring(0, this.messageIndex + 1), context.context);
                    this.shapes.text.draw(context, program_state, introduction_transform, this.materials.text);
                    this.messageIndex++;
                } else {
                    this.shapes.text.set_string(this.miffyIntroductionMessage, context.context);
                    this.shapes.text.draw(context, program_state, introduction_transform, this.materials.text);
                    firstLineDone = true;
                }
            }

            if(this.showCapyIntroductionMessage){
                if (this.messageIndex < this.capyIntroductionMessage.length) {
                    this.shapes.text.set_string(this.capyIntroductionMessage.substring(0, this.messageIndex + 1), context.context);
                    this.shapes.text.draw(context, program_state, introduction_transform, this.materials.text);
                    this.messageIndex++;
                } else {
                    this.shapes.text.set_string(this.capyIntroductionMessage, context.context);
                    this.shapes.text.draw(context, program_state, introduction_transform, this.materials.text);
                    firstLineDone = true;
                }
            }

            if(!this.showMiffyIntroductionMessage && !this.showCapyIntroductionMessage){
                firstLineDone = true;
            }

            if (this.messageIndex2 < this.drinkChoicesMessage.length && firstLineDone) {
                this.shapes.text.set_string(this.drinkChoicesMessage.substring(0, this.messageIndex2 + 1), context.context);
                this.shapes.text.draw(context, program_state, drinkChoices_transform, this.materials.text);
                this.messageIndex2++;
            } else if (firstLineDone) {
                this.shapes.text.set_string(this.drinkChoicesMessage, context.context);
                this.shapes.text.draw(context, program_state, drinkChoices_transform, this.materials.text);
                secondLineDone = true;
            }

            if (this.messageIndex3 < this.drinkOptionGreenTea.length && secondLineDone) {
                this.shapes.text.set_string(this.drinkOptionGreenTea.substring(0, this.messageIndex3 + 1), context.context);
                this.shapes.text.draw(context, program_state, greenTea_transform, this.materials.text);
                this.messageIndex3++;
            } else if (secondLineDone){
                this.shapes.text.set_string(this.drinkOptionGreenTea, context.context);
                this.shapes.text.draw(context, program_state, greenTea_transform, this.materials.text);
                thirdLineDone = true;
            }

            if (this.messageIndex4 < this.drinkOptionEspresso.length && thirdLineDone) {
                this.shapes.text.set_string(this.drinkOptionEspresso.substring(0, this.messageIndex4 + 1), context.context);
                this.shapes.text.draw(context, program_state, espresso_transform, this.materials.text);
                this.messageIndex4++;
            } else if (thirdLineDone) {
                this.shapes.text.set_string(this.drinkOptionEspresso, context.context);
                this.shapes.text.draw(context, program_state, espresso_transform, this.materials.text);
                fourthLineDone = true;
            }

            if (this.messageIndex5 < this.drinkOptionLatte.length && fourthLineDone) {
                this.shapes.text.set_string(this.drinkOptionLatte.substring(0, this.messageIndex5 + 1), context.context);
                this.shapes.text.draw(context, program_state, latte_transform, this.materials.text);
                this.messageIndex5++;
            } else if (fourthLineDone){
                this.shapes.text.set_string(this.drinkOptionLatte, context.context);
                this.shapes.text.draw(context, program_state, latte_transform, this.materials.text);
            }

        }

        if(this.showGreenTeaDescription){
            let description_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 24, 0));
            let confirmation_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 20, 0));
            let return_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 17, 0));

            let firstLineDone = false;
            let secondLineDone = false;

            if (this.messageIndex < this.greenTeaDescription.length) {
                this.shapes.text.set_string(this.greenTeaDescription.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.greenTeaDescription, context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                firstLineDone = true;
            }

            if (this.messageIndex2 < this.confirmDrinkChoiceMessage.length && firstLineDone) {
                this.shapes.text.set_string(this.confirmDrinkChoiceMessage.substring(0, this.messageIndex2 + 1), context.context);
                this.shapes.text.draw(context, program_state, confirmation_transform, this.materials.text);
                this.messageIndex2++;
            } else if (firstLineDone){
                this.shapes.text.set_string(this.confirmDrinkChoiceMessage, context.context);
                this.shapes.text.draw(context, program_state, confirmation_transform, this.materials.text);
                secondLineDone = true;
            }

            if (this.messageIndex3 < this.backToDrinkChoicesMessage.length && secondLineDone) {
                this.shapes.text.set_string(this.backToDrinkChoicesMessage.substring(0, this.messageIndex3 + 1), context.context);
                this.shapes.text.draw(context, program_state, return_transform, this.materials.text);
                this.messageIndex3++;
            } else if (secondLineDone){
                this.shapes.text.set_string(this.backToDrinkChoicesMessage, context.context);
                this.shapes.text.draw(context, program_state, return_transform, this.materials.text);
            }

        }

        if(this.showEspressoDescription){
            let description1_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 26, 0));
            let description2_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 23, 0));
            let confirmation_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 19, 0));
            let return_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 16, 0));

            let firstLineDone = false;
            let secondLineDone = false;
            let thirdLineDone = false;

            if (this.messageIndex < this.espressoDescription1.length) {
                this.shapes.text.set_string(this.espressoDescription1.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, description1_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.espressoDescription1, context.context);
                this.shapes.text.draw(context, program_state, description1_transform, this.materials.text);
                firstLineDone = true;
            }

            if (this.messageIndex2 < this.espressoDescription2.length && firstLineDone) {
                this.shapes.text.set_string(this.espressoDescription2.substring(0, this.messageIndex2 + 1), context.context);
                this.shapes.text.draw(context, program_state, description2_transform, this.materials.text);
                this.messageIndex2++;
            } else if (firstLineDone){
                this.shapes.text.set_string(this.espressoDescription2, context.context);
                this.shapes.text.draw(context, program_state, description2_transform, this.materials.text);
                secondLineDone = true;
            }

            if (this.messageIndex3 < this.confirmDrinkChoiceMessage.length && secondLineDone) {
                this.shapes.text.set_string(this.confirmDrinkChoiceMessage.substring(0, this.messageIndex3 + 1), context.context);
                this.shapes.text.draw(context, program_state, confirmation_transform, this.materials.text);
                this.messageIndex3++;
            } else if (secondLineDone){
                this.shapes.text.set_string(this.confirmDrinkChoiceMessage, context.context);
                this.shapes.text.draw(context, program_state, confirmation_transform, this.materials.text);
                thirdLineDone = true;
            }

            if (this.messageIndex4 < this.backToDrinkChoicesMessage.length && thirdLineDone) {
                this.shapes.text.set_string(this.backToDrinkChoicesMessage.substring(0, this.messageIndex4 + 1), context.context);
                this.shapes.text.draw(context, program_state, return_transform, this.materials.text);
                this.messageIndex4++;
            } else if (thirdLineDone){
                this.shapes.text.set_string(this.backToDrinkChoicesMessage, context.context);
                this.shapes.text.draw(context, program_state, return_transform, this.materials.text);
            }

        }

        if(this.showLatteDescription){
            let description_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 24, 0));
            let confirmation_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 20, 0));
            let return_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 17, 0));

            let firstLineDone = false;
            let secondLineDone = false;

            if (this.messageIndex < this.latteDescription.length) {
                this.shapes.text.set_string(this.latteDescription.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.latteDescription, context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                firstLineDone = true;
            }

            if (this.messageIndex2 < this.confirmDrinkChoiceMessage.length && firstLineDone) {
                this.shapes.text.set_string(this.confirmDrinkChoiceMessage.substring(0, this.messageIndex2 + 1), context.context);
                this.shapes.text.draw(context, program_state, confirmation_transform, this.materials.text);
                this.messageIndex2++;
            } else if (firstLineDone){
                this.shapes.text.set_string(this.confirmDrinkChoiceMessage, context.context);
                this.shapes.text.draw(context, program_state, confirmation_transform, this.materials.text);
                secondLineDone = true;
            }

            if (this.messageIndex3 < this.backToDrinkChoicesMessage.length && secondLineDone) {
                this.shapes.text.set_string(this.backToDrinkChoicesMessage.substring(0, this.messageIndex3 + 1), context.context);
                this.shapes.text.draw(context, program_state, return_transform, this.materials.text);
                this.messageIndex3++;
            } else if (secondLineDone){
                this.shapes.text.set_string(this.backToDrinkChoicesMessage, context.context);
                this.shapes.text.draw(context, program_state, return_transform, this.materials.text);
            }

        }

        //User is prompted to provide a star
        if(this.showPaymentMessage){
            let payment1_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(-2, 24, 0));
            let payment2_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(-2, 20, 0));
            let firstLineDone = false;

            if (this.messageIndex < this.paymentMessage1.length) {
                this.shapes.text.set_string(this.paymentMessage1.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, payment1_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.paymentMessage1, context.context);
                this.shapes.text.draw(context, program_state, payment1_transform, this.materials.text);
                firstLineDone = true;
            }

            if (this.messageIndex2 < this.paymentMessage2.length && firstLineDone) {
                this.shapes.text.set_string(this.paymentMessage2.substring(0, this.messageIndex2 + 1), context.context);
                this.shapes.text.draw(context, program_state, payment2_transform, this.materials.text);
                this.messageIndex2++;
            } else if (firstLineDone){
                this.shapes.text.set_string(this.paymentMessage2, context.context);
                this.shapes.text.draw(context, program_state, payment2_transform, this.materials.text);
            }

        }


        //Show confirmation
        if(this.showLatteSelection){
            let description_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 24, 0));
            // let confirmation_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 20, 0));
            // let firstLineDone = false;

            if (this.messageIndex < this.choseLatte.length) {
                this.shapes.text.set_string(this.choseLatte.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.choseLatte, context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                //firstLineDone = true;
            }

        }

        //Show confirmation
        if(this.showGreenTeaSelection){
            let description_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 20, 0));
            // let confirmation_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 20, 0));
            // let firstLineDone = false;

            if (this.messageIndex < this.choseGreenTea.length) {
                this.shapes.text.set_string(this.choseGreenTea.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.choseGreenTea, context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                //firstLineDone = true;
            }

        }

        //Show confirmation
        if(this.showEspressoSelection){
            let description_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 20, 0));

            if (this.messageIndex < this.choseEspresso.length) {
                this.shapes.text.set_string(this.choseEspresso.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.choseEspresso, context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
            }

        }

        //In case of error
        if(this.showTryAgain){
            let description_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 20, 0));

            if (this.messageIndex < this.tryAgain.length) {
                this.shapes.text.set_string(this.tryAgain.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.tryAgain, context.context);
                this.shapes.text.draw(context, program_state, description_transform, this.materials.text);
            }

        }

        // Draw Rotating Star
        let star_transform = model_transform;
        let star_size = Math.max(0.2, 0.4*Math.abs(Math.cos(t/2.5)));
        let star_pos = star_transform.times(Mat4.translation(2,1.3,2));
        let background_stars = star_pos;
        background_stars = background_stars.times(Mat4.scale(2, 2, 2));
        star_pos = star_pos.times(Mat4.scale(star_size, star_size, star_size));
        var star_rotation = 5 * Math.sin((1.3*t));
        var star_height = Math.abs(Math.sin(t));



        //if it is in process of growing, lock once it reaches max
        if(this.showStar && this.showStarGrowing && !this.lockStar){
            star_transform = star_pos.times(Mat4.rotation(star_rotation, 0, 1, 0)).times(Mat4.translation(0, star_height, 0));
            if (star_size >0.39) {
                this.starMaxSize = true;
                this.showGrabStarMessage = true;
                this.lockStar = true;
            }
            this.display_obj(context, program_state, star_transform, "specialStar");
        }
        //if just normal idle animation, display it normally
        else if (this.showStar && !this.showStarGrowing && !this.lockStar) {
            star_transform = star_pos.times(Mat4.rotation(star_rotation, 0, 1, 0)).times(Mat4.translation(0, star_height, 0));
            this.display_obj(context, program_state, star_transform, "specialStar");
        }

        //reached max size, lock it!
        if(this.lockStar && this.showStar)
        {
            let star_locked = model_transform;
            star_locked = star_locked.times(Mat4.translation(2,1.3,2)).times(Mat4.scale(0.4, 0.4, 0.4));
            star_transform = star_locked.times(Mat4.rotation(star_rotation, 0, 1, 0)).times(Mat4.translation(0, star_height, 0));
            // this.shapes.specialStar.draw(context, program_state, star_transform, this.materials.specialStar));
            this.display_obj(context, program_state, star_transform, "specialStar");
        }

        if(this.showGrabStarMessage){
            let grabStar_transform = Mat4.identity().times(Mat4.rotation(85 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(-4.5, 18, -15));

            if (this.messageIndex < this.grabStarMessage.length) {
                this.shapes.text.set_string(this.grabStarMessage.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, grabStar_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.grabStarMessage, context.context);
                this.shapes.text.draw(context, program_state, grabStar_transform, this.materials.text);
            }

        }

        if(this.showGiveStarMessage){
            let giveStar_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 20, 0));

            if (this.messageIndex < this.giveStarMessage.length) {
                this.shapes.text.set_string(this.giveStarMessage.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, giveStar_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.giveStarMessage, context.context);
                this.shapes.text.draw(context, program_state, giveStar_transform, this.materials.text);
            }

        }

        //draw sign
        let sign_transform = cloudCounter_transform;
        var sign_height = 0.05*(Math.sin(t+3));
        sign_transform = cloudCounter_transform.times(Mat4.translation(0, -3, -3.5)).times(Mat4.scale(3,3,3)).times(Mat4.translation(0, 2.2, 1.5));
        sign_transform = sign_transform.times(Mat4.translation(0, sign_height, 0));
        this.shapes.cafeSign.draw(context, program_state, sign_transform, this.materials.cloudCounter);

        //Draw Background Stars
        this.drawStars(context, program_state, background_stars);

        if (this.makeDrink) {
            //start creating the drink
            let drink_transform = cup_transform;
            //drink idle stirring
            drink_transform = drink_transform.times(Mat4.rotation(190.05, 1, 0, 0)).times(Mat4.rotation(25/t**(1/5), 0, 0, 1)).times(Mat4.scale(1, 1, 1)).times(Mat4.translation(0,0.05,-1));

            if (this.magic_sound) {
                this.magic_sound = false
                this.playsound("magic", 1);
            }
            //for some reason if the drink choice is not initialized, advise person to go back to selecting
            if (this.drink_choice === "") {
                this.showTryAgain = true;
            }

            //draw selected drink
            this.shapes.drink.draw(context, program_state, drink_transform, this.materials[this.drink_choice]);
        }

        if(this.showDrinkFinishedMessage){
            let finished1_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 24, 0));
            let finished2_transform = Mat4.identity().times(Mat4.rotation(29 * Math.PI / 180, 0, 1, 0)).times(Mat4.scale(0.25, 0.25, 0.25)).times(Mat4.translation(0, 20, 0));
            let firstLineDone = false;

            if (this.messageIndex < this.drinkFinishedMessage1.length) {
                this.shapes.text.set_string(this.drinkFinishedMessage1.substring(0, this.messageIndex + 1), context.context);
                this.shapes.text.draw(context, program_state, finished1_transform, this.materials.text);
                this.messageIndex++;
            } else {
                this.shapes.text.set_string(this.drinkFinishedMessage1, context.context);
                this.shapes.text.draw(context, program_state, finished1_transform, this.materials.text);
                firstLineDone = true;
            }

            if (this.messageIndex2 < this.drinkFinishedMessage2.length && firstLineDone) {
                this.shapes.text.set_string(this.drinkFinishedMessage2.substring(0, this.messageIndex2 + 1), context.context);
                this.shapes.text.draw(context, program_state, finished2_transform, this.materials.text);
                this.messageIndex2++;
            } else if (firstLineDone){
                this.shapes.text.set_string(this.drinkFinishedMessage2, context.context);
                this.shapes.text.draw(context, program_state, finished2_transform, this.materials.text);
            }

        }

        if (this.attached !== undefined) {
            program_state.camera_inverse = this.attached().map((x,i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.1));
        }

    }
}

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 color;
        
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                
                color = vec4(shape_color.xyz * ambient, shape_color.w);
                color.xyz += phong_model_lights(N, vertex_worldspace);
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                       
                // // Compute an initial (ambient) color:
                gl_FragColor = color;
                
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
          center = model_transform * vec4(0, 0, 0, 1);
          point_position = model_transform * vec4(position, 1);
          gl_Position = projection_camera_model_transform * vec4(position, 1.0); 
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
          float scalar = sin(18.07 * distance(point_position.xyz, center.xyz));
          gl_FragColor = scalar * vec4(0.7, 0.399, 0.1, 1.0);
        }`;
    }
}
