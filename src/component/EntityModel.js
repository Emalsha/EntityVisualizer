import React, { Component } from 'react';
import convert from 'xml-js';
import { GojsDiagram } from 'react-gojs';
import go from 'gojs';
import credential from './config';

function uniq(a) {
    return a.sort(compare).filter(function(item, pos, ary) {
        return !pos || item.to !== ary[pos - 1].to;
    })
}

function compare(a,b) {
    if (a.from < b.from)
      return -1;
    if (a.from > b.from)
      return 1;
    return 0;
}

class EntityModel extends Component{

    constructor(props){
        super(props);

        this.state = {
            model : {
                nodeDataArray: [
                    { key: 'A', color: 'lightblue' },
                    { key: 'B', color: 'orange' }
                ],
                linkDataArray: [
                    { from: 'A', to: 'B' },
                ]
            },
        }
    }

    createDiagram = diagramId => {
        const $ = go.GraphObject.make;
        const myDiagram = $(go.Diagram, diagramId, {
            initialContentAlignment: go.Spot.LeftCenter
        });
        myDiagram.nodeTemplate = $(
            go.Node,
            'Auto',
            $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 }, new go.Binding('fill', 'color')),
            $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'key'))
        );

        return myDiagram;
    };


    componentDidMount(){
        const newEle = [];
        const newRel = [];
        fetch("http://sdlntcorp02:88/Corporate/CampusNetCorporate.svc/$metadata",{
            method:'GET',
            credentials:'include',
            headers: new Headers({
                'Content-Type':'application/x-www-form-urlencoded',
            }),
            Authorization: credential.username + ':' + credential.password,
        })
        .then(response => response.text())
        .then(schema=> convert.xml2json(schema,{compact:false,spaces:4}))
        .then(d => JSON.parse(d))
        .then(json => json.elements[0].elements[0].elements[0].elements.filter(data => data.name === "EntityType"))
        .then(asad => { console.log(asad); return asad; }) //TODO : TEMP
        .then(Emodel => {
            Emodel.map( d => {
                newEle.push({ key: d.attributes.Name, color: 'lightblue' });
                d.elements.filter( e => e.name === "NavigationProperty" ).map(m => {
                    let obj = {
                        from: m.attributes.Relationship.split('.')[1].split('_')[0],
                        to: m.attributes.Relationship.split('.')[1].split('_')[1]
                    };
                    newRel.push(obj);
                });
            });
            return { 'nodeDataArray' : newEle, 'linkDataArray' : uniq(newRel)};
        })
        .then( model => { console.log(model); this.setState( { model }); }  );
    }

    render(){

        return(
            <GojsDiagram
                    diagramId="myDiagramDiv"
                    model={this.state.model}
                    createDiagram={this.createDiagram}
                    className="myDiagram"
                />
        );
    }

}

export default EntityModel;