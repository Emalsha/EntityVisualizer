import React, { Component } from 'react';
import './App.css';
import EntityModel from './component/EntityModel';
import { CREDENTIAL } from './component/config';
import convert from 'xml-js';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';
import SearchIcon from '@material-ui/icons/Search';
import CssBaseline from '@material-ui/core/CssBaseline';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { MuiThemeProvider,createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  typography: {
    useNextVariants: true,
  },
});

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

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      search : "",
      anchorEl: null,
      entityList: [],
      searchResult: null,
      model : {
        nodeDataArray: [],
        linkDataArray: []
      },
      searchModel: {
        nodeDataArray: [],
        linkDataArray: []
      },
    }
  }

  componentDidMount(){
    const newEle = [];
    const newRel = [];
    const newLis = [];
    fetch("http://sdlntcorp02:88/Corporate/CampusNetCorporate.svc/$metadata",{
        method:'GET',
        credentials:'include',
        headers: new Headers({
            'Content-Type':'application/x-www-form-urlencoded',
        }),
        Authorization: CREDENTIAL.username + ':' + CREDENTIAL.password,
    })
    .then(response => response.text())
    .then(schema=> convert.xml2json(schema,{compact:false,spaces:4}))
    .then(d => JSON.parse(d))
    .then(json => json.elements[0].elements[0].elements[0].elements.filter(data => data.name === "EntityType"))
    .then(asad => { console.log(asad); return asad; }) //TODO : TEMP
    .then(Emodel => {
        Emodel.map( d => {
            newEle.push({ key: d.attributes.Name, color: 'lightblue' });
            newLis.push( d.attributes.Name );
            d.elements.filter( e => e.name === "NavigationProperty" ).map(m => {
                let obj = {
                    from: m.attributes.Relationship.split('.')[1].split('_')[0],
                    to: m.attributes.Relationship.split('.')[1].split('_')[1]
                };
                newRel.push(obj);
            });
        });
        this.setState( { entityList : newLis } );
        return { 'nodeDataArray' : newEle, 'linkDataArray' : uniq(newRel)};
    })
    .then( model => this.setState( { model }) );
}

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  onSearch = (e) => {
    this.setState({ search : e.target.value });
    if(this.state.entityList.length > 0){
      let searchResult = this.state.entityList.filter((item)=> item.toLowerCase().startsWith(e.target.value.toLowerCase()));
      this.setState({searchResult});
      this.setState({ anchorEl: e.target});
    }
  }

  searchOnClick = (entity) => {
    this.setState({
      anchorEl: null,
      search:entity
    });
    this.fileterModel(entity);
  }

  fileterModel(entity){
    const tempNode = this.state.model.nodeDataArray.filter((e)=>e.key === entity);
    const tempRela = this.state.model.linkDataArray.filter((e)=>e.from === entity);
    tempRela.map((m)=> tempNode.push({ key: m.to , color: 'lightblue' }))
    this.setState( { searchModel : { nodeDataArray : tempNode , linkDataArray: tempRela}});
    console.log(tempNode);
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <ScatterPlotIcon className={classes.icon} />
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            Datenlotsen CNC Entity Model
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <div>
                <InputBase
                  placeholder="Search…"
                  id="entityName"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  value={this.state.search}
                  autoFocus={true}
                  onChange={this.onSearch}
                />
                <Popper
                  id="search-result"
                  open={open}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                  className={classes.popper}
                  transition
                >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                    { this.state.searchResult.map( (entity) => {
                      return <Typography
                                className={classes.searchlist}
                                key={entity}
                                onClick={ () => this.searchOnClick(entity)}
                              >
                              {entity}
                            </Typography>
                    }
                    )}

                    </Paper>
                  </Fade>
                )}
                </Popper>
              </div>
            </div>
          </Toolbar>
        </AppBar>

        <main>
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <EntityModel
                model={this.state.searchModel}
                search={this.state.search}
              />
            </div>
          </div>
        </main>

        <footer className={classes.footer}>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              Built with <span role="img" aria-label="love">❤️</span> by the Emalsha.
            </Typography>
        </footer>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  appBar: {
      position: 'relative',
  },
  icon: {
      marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
      width: '100%',
      margin: '0 auto',
      padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
    width: 1100,
    marginLeft: 'auto',
    marginRight: 'auto',
    },
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 4,
  },
  searchlist: {
    padding: theme.spacing.unit * 1,
    cursor: 'pointer'
  },
  popper:{
    top: '60px !important',
    zIndex: 2,
  },

});

App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(App);
