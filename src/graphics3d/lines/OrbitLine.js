

import { LineBasicMaterial, BufferGeometry, Geometry, Line, BufferAttribute, VertexColors, Vector3 } from 'three';
import Dimensions from 'graphics3d/Dimensions';
import DebugPoint from 'graphics3d/utils/DebugPoint';
import { darken, hexToRgb, rgbToHex } from 'utils/ColorUtils';
import { IS_SCREENSHOT, IS_CAPTURE } from 'constants';
import { getUniverse } from 'JSOrrery';


export default {
	init(name, color, isSolid) {
		this.name = name;
		this.added = false;
		this.isSolid = isSolid;
		this.isGradient = !isSolid;
		this.color = color;
	},

	createSolidLine(orbitVertices) {
		const material = new LineBasicMaterial({
			color: IS_SCREENSHOT || IS_CAPTURE ? this.color : rgbToHex(darken(hexToRgb(this.color), 0.5)),
		});
		orbitVertices.forEach(val => Dimensions.getScaled(val));
		const orbitGeom = new Geometry();
		orbitGeom.vertices = orbitVertices;
		return new Line(orbitGeom, material);
	},

	createGradientLine(orbitVertices) {
		const l = orbitVertices.length;
		this.orbitVertices = orbitVertices.map((val) => {
			return Dimensions.getScaled(val);
		});

		this.nVertices = this.orbitVertices.length;

		const nNumbers = this.nPos = l * 3;

		const pos = this.positions = new Float32Array(3 + nNumbers);
		this.buildPositions();

		pos[nNumbers] = this.orbitVertices[0].x;
		pos[nNumbers + 1] = this.orbitVertices[0].y;
		pos[nNumbers + 2] = this.orbitVertices[0].z;
		

		const origColor = hexToRgb(this.color);
		const colors = orbitVertices.map((v, i) => {
			// return origColor;
			return darken(origColor, 1 - i / l);
		}).reduce((a, c, i) => {
			const n = i * 3;			
			a[n] = c.r / 255;
			a[n + 1] = c.g / 255;
			a[n + 2] = c.b / 255;
			return a;
		}, new Float32Array(3 + nNumbers));
		
		colors[nNumbers] = origColor.r / 255;
		colors[nNumbers + 1] = origColor.g / 255;
		colors[nNumbers + 2] = origColor.b / 255;

		const material = new LineBasicMaterial({
			vertexColors: VertexColors,
		});
		const orbitGeom = this.geometry = new BufferGeometry();

		orbitGeom.addAttribute('position', new BufferAttribute(pos, 3));
		
		orbitGeom.addAttribute('color', new BufferAttribute(colors, 3));

		return new Line(orbitGeom, material);
	},

	buildPositions() {
		for (let i = 0; i < this.nVertices; i++) {
			const v = this.orbitVertices[i];
			const n = i * 3;
			this.positions[n] = v.x;
			this.positions[n + 1] = v.y;
			this.positions[n + 2] = v.z;
		}
	},

	setLine(orbitVertices) {
		this.line = this.isSolid ? this.createSolidLine(orbitVertices) : this.createGradientLine(orbitVertices);
	},

	showAllVertices() {
		DebugPoint.removeAll();
		this.orbitVertices.forEach(v => DebugPoint.add(v, 0xaaaaaa));
	},


	updatePos(pos, vel) {
		DebugPoint.removeAll();
		
		DebugPoint.addArrow(pos, vel, 1, 0x00aaff);
		const numberBehind = this.getNVerticesBehindPos(pos, vel);
		this.geometry.attributes.position.needsUpdate = true;
		
		if (numberBehind) {
			const sorted = [];
			for (let inc = 0, index = numberBehind; inc < this.nVertices; inc++, index++) {
				if (index === this.nVertices) index = 0;
				sorted[inc] = this.orbitVertices[index];
			}
			const startVertex = sorted[this.nVertices - 2];
			const dumpedVertex = sorted[this.nVertices - 1];
			const vLen = startVertex.distanceTo(dumpedVertex);
			const newVertex = pos.clone().sub(startVertex).setLength(vLen).add(startVertex);
			// DebugPoint.add(newVertex, 0xffffaa);
			
			sorted[this.nVertices - 1] = newVertex;
			this.orbitVertices = sorted;
			// this.showAllVertices();
			this.buildPositions();
		}

		this.positions[this.nPos] = pos.x;
		this.positions[this.nPos + 1] = pos.y;
		this.positions[this.nPos + 2] = pos.z;

	},
	

	getNVerticesBehindPos(pos, vel) {
		let current;
		let previous1;
		let previous2;
		console.clear();
		
		for (let i = 0; i < this.nVertices; i++) {
			// console.log(i);
			const vertex = this.orbitVertices[i];
			const next = this.orbitVertices[i + 1];
			if (!next) return null;

			const diff = vertex.clone().sub(next);
			const angle = diff.angleTo(vel);
			DebugPoint.addArrow(vertex, diff, diff.length());

			const data = { i, vertex, angle };
			previous2 = previous1;
			previous1 = current;
			current = data;
			console.log(angle);
			//we need at least 2
			if (!previous1) continue;
			//vectro between this vertex and the previous one. We are searching for the segment that matches velocity the most.
			
			// const angle = current.diff.angleTo(previous1.diff);
			// if (angle > 0.5) return previous1.i + 1;
			
			//if distance between pos and first vertex is smaller than distance between first 2 vertices, we ar enot passed first
			// if (i === 1 && current.vertex.distanceTo(previous1.vertex) >= previous1.dist) return null;
			// //distance begins to rise. We are past our vertex. It's either the previous one or the one before.
			if (angle > previous1.angle) {
				if (previous2) {
					//angle between positions will tell us if the first passed vertex is the last one or the one before
					// const angle = current.diff.angleTo(previous1.diff);
					// // console.log(angle);
					// if (angle > 1) {
					// 	// DebugPoint.add(previous2.vertex, 0x55ff00);
					// 	// DebugPoint.add(previous1.vertex, 0x777777);
					// 	// DebugPoint.add(current.vertex, 0x777777);
					// 	// getUniverse().stop(true);
					// 	return previous2.i + 1;
					// }	
					return previous1.i + 1;
				}

				return null;
			}
		}
		// console.log('none');
		return null;
	},

	getDisplayObject() {
		return this.line;
	},

};