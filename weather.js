#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { printError, printSuccess, printHelp, printWeather } from './services/log.service.js';
import {saveKeyValue, getKeyValue, tokenDictionary} from './services/storage.service.js';
import {getWeather, getIcon} from './services/api.service.js';

const saveToken = async (token) => {
    if (!token.length) {
        printError('Не передан токен');
        return;
    }
    try {
        await saveKeyValue(tokenDictionary.token, token);
        printSuccess('Токен сохранён');
    } catch (err) {
        printError(err.message);
    }
};

const saveCity = async (city) => {
    if (!city.length) {
        printError('Не передан город');
        return;
    }
    try {
        await saveKeyValue(tokenDictionary.city, city);
        printSuccess('Город сохранён');
    } catch (err) {
        printError(err.message);
    }
};

const getForcast = async () => {
    try {
        const city = process.env.CITY ?? await getKeyValue(tokenDictionary.city);
        const weather = await getWeather(city);
        printWeather(weather, getIcon(weather.weather[0].icon));
    } catch (e) {
        if (e?.response?.status == 404) {
            printError('Неверно указан город');
        }
        else if (e?.response?.status == 401) {
            printError('Неверно указан токен');
        }
        else {
            printError(e.message);
        }
    }
};
 
const initCLI = () => {
    const args = getArgs(process.argv);
    if (args.h) {
        return printHelp();
    } 
    if (args.s) {
        return saveCity(args.s);
    }
    if (args.t) {
        return saveToken(args.t);
    }
    return getForcast();
};

initCLI();

