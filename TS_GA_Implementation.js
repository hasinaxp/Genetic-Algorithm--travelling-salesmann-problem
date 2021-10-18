/*
Genetic Algorithm Implementation - Travelling salesman problem
Subject -Soft Computing (M.Tech 1st Sem)
Submittted by - SPANDAN MONDAL (2021ITM010)
 */

//--------------------	algorithms----------------------------------
let fitnessFactor = 1000;

class GA_TravellingSalesman {
	constructor(coordinates, nSelection, nPopulation) {
		this.population = [];
		this.coordinates = coordinates;
		this.nCoordinates = coordinates.length;
		this.nSelection = nSelection;
		this.nPopulation = nPopulation;
		this.maxGeneration = 30;
	}

	Distance(c1, c2) {
		//if (c1.x === c2.x && c1.y === c2.y) return Infinity;
		return Math.sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y));
	}
	//fitness function
	Fitness(chromosome) {
		
		let totalDistance = 0;
		for (let i = 0; i < chromosome.length - 1; i++) {
			totalDistance += this.Distance(this.coordinates[chromosome[i] - 1], this.coordinates[chromosome[i + 1] - 1]);
		}
		return (fitnessFactor / totalDistance);
	}
	

	Crossover_OnePoint(chromosome1, chromosome2) {
		let offSpring1 = new Array(this.nCoordinates);
		let offSpring2 = new Array(this.nCoordinates);

		const cp = Math.floor(this.nCoordinates / 2);
		for (let i = 0; i < cp; i++) {
			offSpring1[i] = chromosome2[i];
			offSpring2[i] = chromosome1[i];
		}

		for (let i = cp; i < this.nCoordinates; i++) {
			if (!offSpring1.includes(chromosome1[i]))
				offSpring1[i] = chromosome1[i];
			else
				offSpring1[i] = 0;
			if (!offSpring2.includes(chromosome2[i]))
				offSpring2[i] = chromosome2[i];
			else
				offSpring2[i] = 0;
		}
		let rem1 = [];
		let rem2 = [];
		let rn1 = 0;
		let rn2 = 0;
		for (let i = 0; i < this.nCoordinates; i++) {
			if (!offSpring1.includes(chromosome1[i]))
				rem1.push(chromosome1[i]);
			if (!offSpring2.includes(chromosome2[i]))
				rem2.push(chromosome2[i]);
		}
		for (let i = 0; i < this.nCoordinates; i++) {
			if (offSpring1[i] == 0) {
				offSpring1[i] = rem1[rn1++];
			}
			if (offSpring2[i] == 0) {
				offSpring2[i] = rem2[rn2++];
			}
		}

		return [offSpring1, offSpring2];
	}

	Crossover_TwoPoint(chromosome1, chromosome2) {
		let offSpring1 = new Array(this.nCoordinates);
		let offSpring2 = new Array(this.nCoordinates);

		const cp1 = Math.floor(this.nCoordinates / 3);
		const cp2 = Math.floor(this.nCoordinates * 2 / 3);

		for (let i = cp1; i < cp2; i++) {
			offSpring1[i] = chromosome2[i];
			offSpring2[i] = chromosome1[i];
		}
		for (let i = 0; i < cp1; i++) {
			if (!offSpring1.includes(chromosome1[i]))
				offSpring1[i] = chromosome1[i];
			else
				offSpring1[i] = 0;
			if (!offSpring2.includes(chromosome2[i]))
				offSpring2[i] = chromosome2[i];
			else
				offSpring2[i] = 0;
		}

		for (let i = cp2; i < this.nCoordinates; i++) {
			if (!offSpring1.includes(chromosome1[i]))
				offSpring1[i] = chromosome1[i];
			else
				offSpring1[i] = 0;
			if (!offSpring2.includes(chromosome2[i]))
				offSpring2[i] = chromosome2[i];
			else
				offSpring2[i] = 0;
		}
		let rem1 = [];
		let rem2 = [];
		let rn1 = 0;
		let rn2 = 0;
		for (let i = 0; i < this.nCoordinates; i++) {
			if (!offSpring1.includes(chromosome1[i]))
				rem1.push(chromosome1[i]);
			if (!offSpring2.includes(chromosome2[i]))
				rem2.push(chromosome2[i]);
		}
		for (let i = 0; i < this.nCoordinates; i++) {
			if (offSpring1[i] == 0) {
				offSpring1[i] = rem1[rn1++];
			}
			if (offSpring2[i] == 0) {
				offSpring2[i] = rem2[rn2++];
			}
		}
		return [offSpring1, offSpring2];
	}

	Mutate(chromosome, freq = 2) {
		let chromosomeNew = [];
		for (let i = 0; i < this.nCoordinates; i++) {
			chromosomeNew.push(chromosome[i]);
		}
		for (let i = 0; i < freq; i++) {
			let p = Math.floor(Math.random() * (this.nCoordinates - 1));
			let q = Math.floor(Math.random() * (this.nCoordinates - 1));
			let c = chromosomeNew[p]
			chromosomeNew[p] = chromosomeNew[q];
			chromosomeNew[q] = c;
		}
		return chromosomeNew;
	}

	Selection_Roulettewheel(population) {
		let fitnessValues = new Array(population.length);
		let probabilities = new Array(population.length);
		let ft = 0;
		for (let i = 0; i < population.length; i++) {
			fitnessValues[i] = this.Fitness(population[i]);
			ft += fitnessValues[i];
		}
		for (let i = 0; i < population.length; i++) {
			probabilities[i] = { p: fitnessValues[i] / ft, index: i };
		}

		// sorting by probability in decending order 
		let sp = probabilities.sort((a, b) => b.p - a.p);
		//console.log(sp);
		let selectedChromosomes = new Array(this.nSelection);
		for (let i = 0; i < this.nSelection; i++) {
			selectedChromosomes[i] = population[sp[i].index];
		}
		return {selectedChromosomes, bestFitness: fitnessValues[sp[0].index], worstFitness:fitnessValues[sp[sp.length -1].index]};
	}
	Selection_ElitismMechanism(population) {
		let fitnessValues = new Array(population.length);
		let fvc = new Array(population.length);
		let ft = 0;
		for (let i = 0; i < population.length; i++) {
			fitnessValues[i] = this.Fitness(population[i]);
			fvc[i] = { p: fitnessValues[i], index: i };

		}

		// sorting by best fitness
		let sp = fvc.sort((a, b) => b.p - a.p);
		let selectedChromosomes = new Array(this.nSelection);
		for (let i = 0; i < this.nSelection; i++) {
			selectedChromosomes[i] = population[sp[i].index];
		}
		return {selectedChromosomes, bestFitness: fitnessValues[sp[0].index], worstFitness:fitnessValues[sp[sp.length -1].index]};
	}
	InitializePopulation() {
		let baseCromosome = []; // [1,2,3,....]
		for (let i = 0; i < this.nCoordinates; i++) {
			baseCromosome.push(i + 1);
		}
		for (let i = 0; i < this.nPopulation; i++) {
			this.population.push(this.Mutate(baseCromosome, this.nCoordinates));
		}
	}

	Simulate(crossoverType = '1p', SelectionType = 'rw') {



		//genetic algorithm
		this.InitializePopulation();

		let generation = 1;
		const maxMutation = nCoordinates / 5;

		let generationLog = [];
		let wf = 1000;

		while (generation != this.maxGeneration) {
			//selection
			let {selectedChromosomes, bestFitness, worstFitness} = SelectionType == 'rw' ? this.Selection_Roulettewheel(this.population) : this.Selection_ElitismMechanism(this.population);
			if(worstFitness < wf) wf = worstFitness; 
			generationLog.push({
				bestChromosome : selectedChromosomes[0],
				bestFitness : bestFitness.toFixed(5)
			});
			//next generation chromosomes;
			let offsprings = [];

			for (let i = 0; i < this.nPopulation / 2; i++) {
				//random parents
				let p1 = selectedChromosomes[Math.floor(Math.random() * this.nSelection)];
				let p2 = selectedChromosomes[Math.floor(Math.random() * this.nSelection)];
				//crossover
				let [off1, off2] = crossoverType == '1p' ? this.Crossover_OnePoint(p1, p2) : this.Crossover_TwoPoint(p1, p2);
				//mutation
				off1 = this.Mutate(off1, Math.floor(Math.random() * maxMutation));
				off2 = this.Mutate(off2, Math.floor(Math.random() * maxMutation));

				//appending to offsprings
				offsprings.push(off1);
				offsprings.push(off2);
				//setting offsprings as next generaton
				//js uses refetances for complex datas so don't worry about performance issue
			}
			this.population = offsprings;
			generation++;
		}
		let results = SelectionType == 'rw' ? this.Selection_Roulettewheel(this.population) : this.Selection_ElitismMechanism(this.population);
		return {
			generationLog,
			path : results.selectedChromosomes[0],
			finalFitness : results.bestFitness,
			worstFitness : wf
		};
	}
};


//---------------------implementation-------------------------------
const _id = id => document.getElementById(id)
const MAX_DIST = 1000;


let nCoordinates = 10;
let coordinates = [];


function Main(e) {
	if (e.target.id == 'gen') {
		//generating random cities
		nCoordinates = Number(_id('city_no').value);
		coordinates = new Array();
		for (let i = 0; i < nCoordinates; i++) {
			coordinates.push({
				x: Math.floor(Math.random() * MAX_DIST),
				y: Math.floor(Math.random() * MAX_DIST),
			})
		}
	}
	ClearCanvas();
	PlotCoordinates(coordinates);
	let ci = 0;
	Table(_id('coordinate_list'), coordinates.map(c => { c.id = ++ci; return c; }));


	//Genetic Algorithm
	let nSelection = _id('selection_size').value;
	let nPopulation = _id('population_size').value;
	let crossoverType = _id('crossover_type').value;
	let SelectionType = _id('selection_type').value;

	let tsga = new GA_TravellingSalesman(coordinates, nSelection, nPopulation);
	let finalOutput = tsga.Simulate(crossoverType, SelectionType);
	_id('suggested_path').innerHTML = finalOutput.path.join('-');
	_id('total_distance').innerHTML = (fitnessFactor / finalOutput.finalFitness).toFixed(2);
	_id('max_distance').innerHTML = (fitnessFactor / finalOutput.worstFitness).toFixed(2);
	PlotPath(finalOutput.path, coordinates);
	Table(_id('genarations'), finalOutput.generationLog);

	let vals = [];
	for(let i = 0; i < finalOutput.generationLog.length; i++) {
		let g = finalOutput.generationLog[i];
		vals.push({
			x : i+ 1,
			y : Number(g.bestFitness)
		})
	}
	PlotGraph2(_id('plot1'), vals, "Fitness - Generation");

	let vals2= [];
	let populations = [100, 150, 200, 250, 300, 400, 600, 800];
	for(let i = 0; i < populations.length; i++) {
		tsga.nPopulation = populations[i];
		tsga.maxGeneration = 20;
		let out = tsga.Simulate(crossoverType, SelectionType);
		vals2.push({
			x : populations[i],
			y: out.finalFitness.toFixed(5)
		});
	}
	PlotGraph2(_id('plot2'), vals2, "Fitness - population");
	Table(_id('pf_list'), vals2.map(v => {return {populationSize : v.x, fitness: v.y};}));




}

_id('gen').addEventListener('click', e => {
	Main(e);
});

_id('eval').addEventListener('click', e => {
	Main(e);
});
