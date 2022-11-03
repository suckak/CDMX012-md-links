#!/usr/bin/env node

//  __/\\\\\\\\\\\\_______________________________________________________/\\\\\\____
//   _\/\\\////////\\\____________________________________________________\////\\\____
//    _\/\\\______\//\\\_______________________________/\\\___________________\/\\\____
//     _\/\\\_______\/\\\__/\\\\\\\\\_____/\\/\\\\\\___\///______/\\\\\\\\_____\/\\\____
//      _\/\\\_______\/\\\_\////////\\\___\/\\\////\\\___/\\\___/\\\/////\\\____\/\\\____
//       _\/\\\_______\/\\\___/\\\\\\\\\\__\/\\\__\//\\\_\/\\\__/\\\\\\\\\\\_____\/\\\____
//        _\/\\\_______/\\\___/\\\/////\\\__\/\\\___\/\\\_\/\\\_\//\\///////______\/\\\____
//         _\/\\\\\\\\\\\\/___\//\\\\\\\\/\\_\/\\\___\/\\\_\/\\\__\//\\\\\\\\\\__/\\\\\\\\\_
//          _\////////////______\////////\//__\///____\///__\///____\//////////__\/////////__

import chalk from "chalk";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import util from "util";
import mdLinks from "./index2.js";

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const close = () => {
  console.log("\n");
  const bye = `
     █████╗ ██████╗ ██╗ ██████╗ ███████╗
    ██╔══██╗██╔══██╗██║██╔═══██╗██╔════╝
    ███████║██║  ██║██║██║   ██║███████╗
    ██╔══██║██║  ██║██║██║   ██║╚════██║
    ██║  ██║██████╔╝██║╚██████╔╝███████║
    ╚═╝  ╚═╝╚═════╝ ╚═╝ ╚═════╝ ╚══════╝

  `;
  console.log(gradient.retro.multiline(bye));
  process.exit(1);
};

const [, , path, option1, option2, ...othersOptions] = process.argv;

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    `
   /$$      /$$ /$$$$$$$          /$$       /$$$$$$ /$$   /$$ /$$   /$$  /$$$$$$
  | $$$    /$$$| $$__  $$       | $$       |_  $$_/| $$$ | $$| $$  /$$/ /$$__  $$
  | $$$$  /$$$$| $$  \ $$         | $$        | $$  | $$$$| $$| $$ /$$/ | $$  \__/
  | $$ $$/$$ $$| $$  | $$ /$$$$$$| $$        | $$  | $$ $$ $$| $$$$$/  |  $$$$$$
  | $$  $$$| $$| $$  | $$|______/| $$        | $$  | $$  $$$$| $$  $$   \____  $$
  | $$\  $  | $$| $$  | $$        | $$        | $$  | $$\   $$$| $$\   $$  /$$  \ $$
  | $$ \/   | $$| $$$$$$$/        | $$$$$$$$ /$$$$$$| $$ \   $$| $$ \  $$|  $$$$$$/
  |__/     |__/|_______/         |________/|______/|__/  \__/|__/  \__/ \______/
    \n`
  );

  await sleep();
  rainbowTitle.stop();

  console.log(`
    ${chalk.bgBlue("Hola!")}
    Esta ${chalk.bgGrey(
    "CLI"
  )} te ayudará a encontrar y validar los links de tus archivos .MD
  `);
}

const validateSingleOption = (single) => {
  return (
    single === null ||
    single === undefined ||
    single === "" ||
    single === "--validate" ||
    single === "--stats"
  );
};

const validateOptions = () => {
  if (
    !validateSingleOption(option1) ||
    !validateSingleOption(option2) ||
    othersOptions.length
  ) {
    console.log(
      chalk.bgRed(
        "HEY!, pusiste una opción no valida, recuerda que solo puedes usar --validate y/o --stats"
      )
    );
    close();
  }
};

async function handleWork() {
  const spinner = createSpinner("Buscando links...").start();

  const validate = option1 === '--validate' || option2 === '--validate';
  const stats = option1 === '--stats' || option2 === '--stats';

  try {
    await sleep();
    const links = await mdLinks(path, { validate, stats });
    spinner.success({ text: ` Terminado! \n` });
    process.stdout.write(
      util.inspect(links, {
        colors: true,
        depth: 5,
        maxArrayLength: null,
      })
    );
    close();
    return;

  } catch (err) {
    spinner.error({ text: `💀💀💀 opps! algó falló \n ${err.message} ` });
    close();
  }
}

console.clear();
await welcome();
validateOptions();
await handleWork();
