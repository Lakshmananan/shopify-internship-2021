import { useState } from 'react';

import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const SearchImage = (props) => {
  const [label, setLabel] = useState('');

  const handleChange = (event) => {
    setLabel(event.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();

    // let the app manage the persistence & state
    props.searchImage(label);
  };

  return (
    <Container>
      <TextField
        id="outlined-basic"
        label=""
        variant="outlined"
        value={label}
        onChange={handleChange}
      />
      <div className="input-group-append">
        <Button onClick={handleClick} className="btn btn-primary" type="submit">
          Search
        </Button>
      </div>
    </Container>
  );
};

export default SearchImage;
