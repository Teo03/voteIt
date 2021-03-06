import React from 'react';
import axios from 'axios';
import { Nav } from './Nav';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { Chart } from './Chart';

export class PollLayout extends React.Component {
  constructor(){
    super();
    this.state = {
      name: '',
      options: [],
      creator: '',
      option: '',
      open: false,
      disabled: false,
      message: '',
      openMessage: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.addVote = this.addVote.bind(this);
    this.getPoll = this.getPoll.bind(this);
  }

  addVote = () => {
    if (this.state.option === '') {
        return this.setState({openMessage: true, message: 'Please choose option.'});
    } else {
        return axios.post('/submitVote', {
            pollOption: this.state.option,
            pollId: this.props.match.params.id
        }).then(res => {
            if (res.data === 'success') {
                this.setState({disabled: true, openMessage: true, message: 'Thanks for voting! Voted for ' + this.state.option});
                this.getPoll();
            } else {
                this.setState({
                    disabled: false
                });
                alert('An error occured while voting please try again later.');
            }
        });
    }
}

  handleChange = (e) => {
    this.setState({ option: e.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCloseMessage = () => {
    this.setState({ openMessage: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  getPoll = () => {
    return axios.get('/getPoll/' + this.props.match.params.id).then(res => {
      if(res.data === 'err'){
         alert('Error accessing the poll.')
        } else {
          this.setState({
            name: res.data[0].name,
            options: res.data[0].options,
            creator: res.data[0].creator
          });
        }
      });
  }

  componentDidMount = () => {
    this.getPoll();
  }

  render = () => {
    var options = this.state.options;
    var optionsArr = [];
    var data = [];
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        optionsArr.push(options[key]['option']);
        data.push(options[key]['votes']);
      }
    }

    return (
      <div className='container text-center'>
        <Nav />
        <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        open={this.state.openMessage}
        autoHideDuration={4000} 
        onClose={this.handleCloseMessage}
        message={<h4>{this.state.message}</h4>}/>
        <h1>{this.state.name}</h1>
        <h3>Created by {this.state.creator}</h3>
        <br />
        <br />
        <form>
            <FormControl style={{minWidth: 250, minHeight: 100}}>
                <InputLabel htmlFor="demo-controlled-open-select">Option</InputLabel>
                <Select style={{fontSize: 30}} open={this.state.open} onClose={this.handleClose} onOpen={this.handleOpen} onChange={this.handleChange}
                    value={this.state.option}>
                    {optionsArr.map(option => (
                    <MenuItem style={{fontSize: 30}} key={option} value={option}> {option}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </form>
        <Button variant='raised' color='secondary' size="large" style={{fontSize: 15, marginBottom: 50}} onClick={this.addVote} disabled={this.state.disabled}>SUBMIT VOTE</Button>
        <Chart labels={optionsArr} data={data}/>
      </div>
    );
  }
}