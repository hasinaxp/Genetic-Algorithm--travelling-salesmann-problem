const canvas = document.getElementById('canvas');
canvas.width = 500;
canvas.height = 500;

const dx = 500 / 1160;


const ctx = canvas.getContext('2d');
function ClearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function PlotCoordinates(coordinates) {
	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth = 2;
	for (let i = 0; i < coordinates.length; i++) {
		ctx.beginPath();
		ctx.arc(
			coordinates[i].x * dx,
			coordinates[i].y *dx,
			4,
			0,
			2 * Math.PI
		);
		ctx.stroke();
		ctx.fillText(
			`(${coordinates[i].x}, ${coordinates[i].y})`,
			coordinates[i].x * dx + 8,
			coordinates[i].y * dx + 8,
		)
	}
}
function PlotPath(order, coordinates) {
	ctx.strokeStyle = "#99aabb";
	ctx.lineWidth = 1;
	for(let i = 0; i < order.length - 1; i++) {
		ctx.beginPath();
		let p1 = coordinates[Number(order[i]) -1];
		let p2 = coordinates[Number(order[i + 1]) -1];
		ctx.moveTo(p1.x * dx, p1.y * dx);
		ctx.lineTo(p2.x *dx, p2.y *dx);
		ctx.stroke();
	}
}

function PlotGraph(elem, vals, label = "graph",  steps = 8) {
	const cnv = document.createElement('canvas');
	const c = cnv.getContext('2d');
	cnv.width = 400;
	cnv.height = 420;

	let xMax = 0;
	let yMax = 0;


	for(let v of vals) {
		if(v.x > xMax) xMax = v.x;
		if(v.y > yMax) yMax = v.y;

	}
	xMax *= 1.1;
	yMax *= 1.1;

	let dx = 360 / (xMax);
	let dy = 360 / (yMax);
	c.strokeStyle = "#111111";
	c.beginPath();
	c.moveTo(30, 380);
	c.lineTo(30, 10);
	c.moveTo(30, 380);
	c.lineTo(380, 380);
	c.stroke();
	c.fillText( '0', 10, 390);

	for (let i = 1; i <= steps; i++) {
		let v = (yMax  * i / steps )
		c.fillText(String(v.toFixed(3)), 4, 380 - (v)* dy)
	}
	c.strokeStyle = "#11aacc";
	for(let i = 0; i < vals.length - 1; i++) {
		let v1 = vals[i];
		let v2 = vals[i + 1];
		c.beginPath();
		c.moveTo((v1.x) * dx + 30, 380 - v1.y * dy);
		c.lineTo((v2.x) * dx + 30, 380 - v2.y * dy);
		c.stroke();
	}
	for(let i = 0; i < vals.length; i++) {
		let {x,y} = vals[i];
		c.strokeStyle = "#ff1111";
		c.beginPath();
		c.arc((x) * dx + 30, 380 - (y) * dy, 2, 0, 2 * Math.PI);
		c.stroke();
		c.strokeStyle = "#111111";
		c.fillText(`(${x}, ${y.toFixed(4)})`, (x) * dx + 34, 380 - (y) * dy);
		c.fillText(`${x}`, (x) * dx + 34, 390);
	}

	c.fillText(`graph - ${label}`, 40, 410);
	elem.innerHTML = '';
	elem.appendChild(cnv);

}


function PlotGraph2(elem, vals, label = "graph", width = 600,  steps = 8) {
	const cnv = document.createElement('canvas');
	const c = cnv.getContext('2d');
	cnv.width = width;
	cnv.height = 420;

	let xMax = 0;
	let yMax = 0;
	let xMin = 100;
	let yMin = 100;

	for(let v of vals) {
		if(v.x > xMax) xMax = v.x;
		if(v.y > yMax) yMax = v.y;
		if(v.x < xMin) xMin = v.x;
		if(v.y < yMin) yMin = v.y;
	}
	xMax *= 1.1;
	yMax *= 1.1;
	xMin /= 1.1;
	yMin /= 1.1;
	let dx = (width - 40) / (xMax - xMin);
	let dy = 400 / (yMax - yMin);
	c.strokeStyle = "#111111";
	c.beginPath();
	c.moveTo(30, 380);
	c.lineTo(30, 10);
	c.moveTo(30, 380);
	c.lineTo(width - 20, 380);
	c.stroke();

	for (let i = 1; i <= steps; i++) {
		let v = ((yMax - yMin)  * i / steps + yMin)
		c.fillText(String(v.toFixed(3)), 4, 380 - (v - yMin)* dy)
	}
	c.strokeStyle = "#11aacc";
	for(let i = 0; i < vals.length - 1; i++) {
		let v1 = vals[i];
		let v2 = vals[i + 1];
		c.beginPath();
		c.moveTo((v1.x-xMin) * dx + 34, 380 - (v1.y - yMin) * dy);
		c.lineTo((v2.x-xMin) * dx + 34, 380 - (v2.y - yMin) * dy);
		c.stroke();
	}
	for(let i = 0; i < vals.length; i++) {
		let {x,y} = vals[i];
		c.strokeStyle = "#ff1111";
		c.beginPath();
		c.arc((x-xMin) * dx + 34, 380 - (y - yMin) * dy, 2, 0, 2 * Math.PI);
		c.stroke();
		c.strokeStyle = "#111111";
		//c.fillText(`(${x}, ${y.toFixed(4)})`, (x-xMin) * dx + 34, 380 - (y - yMin) * dy);
		c.fillText(`${x}`, (x-xMin) * dx + 34, 390);
	}

	c.fillText(`graph - ${label}`, 40, 410);
	elem.innerHTML = '';
	elem.appendChild(cnv);

}
function Table(element, data) {
	element.innerHTML = "";
	const table = document.createElement('table');
	const hRow = document.createElement('tr');
	let rows = [];
	for( let i in data[0])
		rows.push(i);
	for(let r of rows) {
		let th = document.createElement('th');
		th.innerHTML = r;
		hRow.appendChild(th);
	}
	table.appendChild(hRow);
	for(let d of data) {
		let temp ='';
		for( let i in d) {
			if(Array.isArray(d[i]))
				temp += `<td>${d[i].join('-')}</td>`
			else
				temp += `<td>${d[i]}</td>`
		}
		let row = document.createElement('tr');
		row.innerHTML = temp;
		table.appendChild(row);
	}
	element.appendChild(table);
}