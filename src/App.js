import React, { Component } from "react";
import shuffle from "lodash.shuffle";

import "./App.css";

import Card from "./Card";
import GuessCount from "./GuessCount";
import HallOfFame, { FAKE_HOF } from "./HallOfFame";

// DECLARATION DES CONSTANTES
const SIDE = 6;
const SYMBOLS = "😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿";
const VISUAL_PAUSE_MSECS = 750;

const autoBind = require("auto-bind");

class App extends Component {
    constructor() {
        super();
        autoBind(this); // Permet de binder mes méthodes pour utiliser "this"
        this.state = {
            cards: this.generateCards(), // Tableau de cards comprenant les symboles
            currentPair: [], // tableau qui va accueillir ma paire
            guesses: 0, // Tentative
            matchedCardIndices: []
        };
    }

    generateCards() {
        const result = []; // Tableau vide
        const size = SIDE * SIDE; // Taille du jeu 36 cases
        const candidates = shuffle(SYMBOLS); // On mélange les symboles
        while (result.length < size) {
            const card = candidates.pop(); // On enregistre un symbole dans une card
            result.push(card, card); // On push dans le tableau vide 2 card du même symbole
        }
        return shuffle(result); // on retourne le tableau mélangé
    }

    handleCardClick(index) {
        const { currentPair } = this.state;

        if (currentPair.length === 2) {
            // permet de clean la sélectionner quand on se trompe en selectionnant 2 cards
            return;
        }

        if (currentPair.length === 0) {
            this.setState({ currentPair: [index] }); // On modifie ma paire initialement vide avec la card que l'on vient de cliquer
            return;
        }

        this.handleNewPairClosedBy(index); // On vient mettre un second index dans le tableau où on les compares pour savoir s'ils sont matchés ou non
    }

    handleNewPairClosedBy(index) {
        const { cards, currentPair, guesses, matchedCardIndices } = this.state;

        const newPair = [currentPair[0], index]; // On constitu la nouvelle paire
        const newGuesses = guesses + 1; // On incrémente notre nombre de tentative
        const matched = cards[newPair[0]] === cards[newPair[1]];
        this.setState({ currentPair: newPair, guesses: newGuesses });
        if (matched) {
            this.setState({
                matchedCardIndices: [...matchedCardIndices, ...newPair]
            });
        }

        // On vide notre paire courrante et on lui dit de le faire après le temps initialiser dans la constante VISUAL_PAUSE
        setTimeout(
            () => this.setState({ currentPair: [] }),
            VISUAL_PAUSE_MSECS
        );
    }

    getFeedbackForCard(index) {
        const { currentPair, matchedCardIndices } = this.state;
        const indexMatched = matchedCardIndices.includes(index);

        if (currentPair.length < 2) {
            return indexMatched || index === currentPair[0]
                ? "visible"
                : "hidden";
        }

        if (currentPair.includes(index)) {
            return indexMatched ? "justMatched" : "justMismatched";
        }

        return indexMatched ? "visible" : "hidden";
    }

    render() {
        const { cards, guesses, matchedCardIndices } = this.state;
        const won = matchedCardIndices.length === cards.length;
        return (
            <div className="memory">
                <GuessCount guesses={guesses} />
                {cards.map((card, index) => (
                    <Card
                        card={card}
                        feedback={this.getFeedbackForCard(index)}
                        index={index}
                        key={index}
                        onClick={this.handleCardClick}
                    />
                ))}
                {won && <HallOfFame entries={FAKE_HOF} />}
            </div>
        );
    }
}

export default App;
