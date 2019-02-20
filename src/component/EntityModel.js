import React, { Component } from 'react';
import { GojsDiagram } from 'react-gojs';
import go from 'gojs';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';



class EntityModel extends Component{

    constructor(props){
        super(props);

        this.state = {
            model : {
                nodeDataArray: [],
                linkDataArray: []
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

    // componentDidMount(){
    //     const newEle = [];
    //     const newRel = [];
    //     const newLis = [];
    //     fetch("http://sdlntcorp02:88/Corporate/CampusNetCorporate.svc/$metadata",{
    //         method:'GET',
    //         credentials:'include',
    //         headers: new Headers({
    //             'Content-Type':'application/x-www-form-urlencoded',
    //         }),
    //         Authorization: CREDENTIAL.username + ':' + CREDENTIAL.password,
    //     })
    //     .then(response => response.text())
    //     .then(schema=> convert.xml2json(schema,{compact:false,spaces:4}))
    //     .then(d => JSON.parse(d))
    //     .then(json => json.elements[0].elements[0].elements[0].elements.filter(data => data.name === "EntityType"))
    //     .then(asad => { console.log(asad); return asad; }) //TODO : TEMP
    //     .then(Emodel => {
    //         Emodel.map( d => {
    //             newEle.push({ key: d.attributes.Name, color: 'lightblue' });
    //             newLis.push( d.attributes.Name );
    //             d.elements.filter( e => e.name === "NavigationProperty" ).map(m => {
    //                 let obj = {
    //                     from: m.attributes.Relationship.split('.')[1].split('_')[0],
    //                     to: m.attributes.Relationship.split('.')[1].split('_')[1]
    //                 };
    //                 newRel.push(obj);
    //             });
    //         });
    //         this.props.addEntityList(newLis);
    //         return { 'nodeDataArray' : newEle, 'linkDataArray' : uniq(newRel)};
    //     })
    //     .then( model => this.setState( { model }) );
    // }

    render(){
        return(
            <React.Fragment>
                <GojsDiagram
                    diagramId="myDiagramDiv"
                    model={this.props.model}
                    createDiagram={this.createDiagram}
                    className="myDiagram"
                />
            </React.Fragment>
        );
    }

}


const styles = theme => ({

});

EntityModel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EntityModel);