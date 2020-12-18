import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import { Navbar, Nav } from 'react-bootstrap'


class AdruleDashboard extends React.Component {
  state = {
      adrules: []
  }

  componentDidMount() {
      fetch('https://django-yara-intel-app.herokuapp.com/api/rules/')
          .then(response => response.json())
          .then(data => {
              this.setState({adrules: data});
          });
  }



  createNewAdrule = (adrule) => {
    fetch('https://django-yara-intel-app.herokuapp.com/api/rules/', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify(adrule),
    })
    .then(response => response.json())
    .then(adrule => {
        this.setState({adrules: this.state.adrules.concat([adrule])});
    });
}

updateAdrule = (newAdrule) => {
  fetch(`https://django-yara-intel-app.herokuapp.com/api/rules/${newAdrule.id}/`, {
      method: 'PUT',
      headers: {
              'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAdrule),
  }).then(response => response.json())
  .then(newAdrule => {
      const newAdrules = this.state.adrules.map(adrule => {
          if(adrule.id === newAdrule.id) {
              return Object.assign({}, newAdrule)
          } else {
              return adrule;
          }
      });
      this.setState({adrules: newAdrules});
  });
}

  deleteAdrule = (adruleId) => {
    fetch(`https://django-yara-intel-app.herokuapp.com/api/rules/${adruleId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(() => {
        this.setState({adrules: this.state.adrules.filter(adrule => adrule.id !== adruleId)})
    });
  }


  render() {
      return (
          
          <Container>
            <div>
            <Navbar bg="dark" variant="dark">
              <Navbar.Brand href="#home">ChalkingCode</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="https://github.com/ChalkingCode/React-App-Yara-Intel-">Code</Nav.Link>
                </Nav>
                </Navbar>
            </div>
            <br />
            <Alert variant="success">
              <Alert.Heading>Yara Intel</Alert.Heading>
              <p>
                I created this app to show my knowledge in react and jsx. I will
                Also be showing my knowledge of threat intel and VT hunting with Yara 
                Rules. I hope you enjoy and happy hunting!
              </p>
              <hr />
              <h1>YARA in a nutshell</h1>
              <br />
              <p>
                YARA is a tool aimed at (but not limited to) helping malware 
                researchers to identify and classify malware samples. With YARA you
                 can create descriptions of malware families (or whatever you want to
                  describe) based on textual or binary patterns. Each description, a.k.a rule, 
                  consists of a set of strings and a boolean expression which determine its logic.
                   Let's see an example:
              </p>
              <code>
                rule silent_banker : banker <br />
                &rbrace;<br />
                    <p style={{marginLeft: '40px'}}>meta:</p>
                    <p style={{marginLeft: '80px'}}> description = "This is just an example"<br />
                        threat_level = 3<br />
                        in_the_wild = true<br /> </p>

                        <p style={{marginLeft: '40px'}}>strings:<br /></p>
                        <p style={{marginLeft: '80px'}}>$a = &rbrace;6A 40 68 00 30 00 00 6A 14 8D 91&rbrace;<br />
                        $b = &rbrace;8D 4D B0 2B C1 83 C0 27 99 6A 4E 59 F7 F9&rbrace;<br />
                        $c = "UVODFRYSIHLNWPEJXQZAKCBGMT"</p>

                        <p style={{marginLeft: '40px'}}>condition:</p>
                        <p style={{marginLeft: '80px'}}>$a or $b or $c<br /></p>
                  &rbrace;
              </code>
  <hr />
  <p className="mb-0">
  The above rule is telling YARA that any file containing one of the three strings must be reported as silent_banker. 
  This is just a simple example, more complex and powerful rules can be created by using wild-cards, case-insensitive strings, 
  regular expressions, special operators and many other features that you'll find explained in YARA's documentation.
  YARA is multi-platform, running on Windows, Linux and Mac OS X, and can be used through its command-line interface or 
  from your own Python scripts with the yara-python extension.
  </p>
</Alert>
<div>
                  <AdruleList
                      adrules={this.state.adrules}
                      onDeleteClick={this.deleteAdrule}
                      onUpdateClick={this.updateAdrule}
                  />
                  <ToggleableAdruleForm
                      onAdruleCreate={this.createNewAdrule}
                  />
              </div>
              </Container>
          
      )
  }
}

class AdruleList extends React.Component {
  render() {
    const adrules = this.props.adrules.map(adrule => (
      <EditableAdrule
        key={adrule.id}
        id={adrule.id}
        title={adrule.title}
        author={adrule.author}
        description={adrule.description}
        rule={adrule.rule}
        onDeleteClick={this.props.onDeleteClick}
        onUpdateClick={this.props.onUpdateClick}
      ></EditableAdrule>
    ));
    return (
      <div>
        {adrules}
      </div>
    );
  }
}

class EditableAdrule extends React.Component {
  state = {
    inEditMode: false
  };
  enterEditMode = () => {
    this.setState({inEditMode: true});
  }
  leaveEditMode = () => {
    this.setState({inEditMode: false});
  }
  handleDelete = () => {
    this.props.onDeleteClick(this.props.id);
  }
  handleUpdate = (adrule) => {
    this.leaveEditMode()
    adrule.id = this.props.id;
    this.props.onUpdateClick(adrule);
  }
  render() {
    const component = () => {
      if(this.state.inEditMode) {
        return (
          <AdruleForm
            id={this.props.id}
            title={this.props.title}
            author={this.props.author}
            description={this.props.description}
            rule={this.props.rule}
            onCancelClick={this.leaveEditMode}
            onFormSubmit={this.handleUpdate}
          />
        );
      }
      return (
        <Adrule
          title={this.props.title}
          author={this.props.author}
          description={this.props.description}
          rule={this.props.rule}
          onEditClick={this.enterEditMode}
          onDeleteClick={this.handleDelete}
        />
      )
    }
    return (
      <div className="mb-3 p-4" style={{boxShadow: '0 0 10px #ccc'}} >
        {component()}
      </div>
    )
  }
}
class Adrule extends React.Component {
  render() {
    return (
      <div className="card" /* style="width: 18rem;" */>
        <div className="card-header d-flex justify-content-between">
          <span>
            <strong>Title: </strong>{this.props.title}
          </span>
          <div>
            <span onClick={this.props.onEditClick} className="mr-2"><FontAwesomeIcon icon={faEdit} /></span>
            <span onClick={this.props.onDeleteClick}><FontAwesomeIcon icon={faTrash} /></span>
          </div>
        </div>
        <div className="card-body">
          {this.props.description}
        </div>
        <div className="card-body">
          <strong>Rule:</strong>  {this.props.rule}
        </div>
        <div className="card-footer">
          <strong>Author:</strong>  {this.props.author}
        </div>
      </div>
    );
  }
}

class AdruleForm extends React.Component {
  state = {
    title: this.props.title || '',
    author: this.props.author || '',
    description: this.props.description || '',
    rule: this.props.rule || ''
  }
  handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.props.onFormSubmit({...this.state});
  }
  handleTitleUpdate = (evt) => {
    this.setState({title: evt.target.value});
  }
  handleAuthorUpdate = (evt) => {
    this.setState({author: evt.target.value});
  }
  handleDescriptionUpdate = (evt) => {
    this.setState({description: evt.target.value});
  }
  handleRuleUpdate = (evt) => {
    this.setState({rule: evt.target.value});
  }
  render() {
    const buttonText = this.props.id ? 'Update Adrule': 'Create Adrule';
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div className="form-group">
          <label>
            Title
          </label>
          <input type="text" placeholder="Enter a title"
            value={this.state.title} onChange={this.handleTitleUpdate}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>
            Author
          </label>
          <input type="text" placeholder="Author's name"
            value={this.state.author} onChange={this.handleAuthorUpdate}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>
            Description
          </label>
          <textarea className="form-control" placeholder="Adrule Description"
            rows="5" value={this.state.description}
            onChange={this.handleDescriptionUpdate}
          >
            {this.state.description}
          </textarea>
        </div>
        <div className="form-group">
          <label>
            Rule
          </label>
          <textarea className="form-control" placeholder="Adrule Rule"
            rows="5" value={this.state.rule}
            onChange={this.handleRuleUpdate}
          >
            {this.state.rule}
          </textarea>
        </div>
        <div className="form-group d-flex justify-content-between">
          <button type="submit" className="btn btn-md btn-primary">
            {buttonText}
          </button>
          <button type="button" className="btn btn-md btn-secondary" onClick={this.props.onCancelClick}>
            Cancel
          </button>
        </div>
      </form>
    )
  }
}
// index.js
class ToggleableAdruleForm extends React.Component {
  state = {
    inCreateMode: false
  }
  handleCreateClick = () => {
    this.setState({inCreateMode: true});
  }
  leaveCreateMode = () => {
    this.setState({inCreateMode: false});
  }
  handleCancleClick = () => {
    this.leaveCreateMode();
  }
  handleFormSubmit = (adrule) => {
    this.leaveCreateMode();
    this.props.onAdruleCreate(adrule);
  }
  render() {
    if (this.state.inCreateMode) {
      return (
        <div className="mb-3 p-4" style={{boxShadow: '0 0 10px #ccc'}} >
          <AdruleForm
            onFormSubmit={this.handleFormSubmit}
            onCancelClick={this.handleCancleClick}></AdruleForm>
        </div>

      )
    }
    return (
      <button onClick={this.handleCreateClick} className="btn btn-secondary">
        <FontAwesomeIcon icon={faPlus} />
      </button>
    );
  }
}
ReactDOM.render(<AdruleDashboard />, document.getElementById('root'));
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
