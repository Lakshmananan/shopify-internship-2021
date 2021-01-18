import { useState } from 'react';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import { Storage, API, graphqlOperation } from 'aws-amplify';
import Predictions from '@aws-amplify/predictions';
import { createPicture } from '../graphql/mutations';
import awsExports from '../aws-exports';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));

const UploadImage = () => {
  const classes = useStyles();

  const [file, setFile] = useState(null);

  const addImageToDB = async (image) => {
    console.log('addimage to db');
    try {
      await API.graphql(graphqlOperation(createPicture, { input: image }));
    } catch (error) {
      console.log(error);
    }
  };

  const findImageLabels = async (file) => {
    console.log('find image labels');
    return Predictions.identify({
      labels: {
        source: {
          file,
        },
        type: 'LABELS',
      },
    })
      .then((response) => {
        let labels = response.labels.map((label) => {
          if (label.metadata.confidence > 70) return label.name;
        });
        return labels.filter(Boolean);
      })
      .catch((err) => console.log({ err }));
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    Storage.put(file.name, file, {
      contentType: 'image/png',
    })
      .then(() => {
        findImageLabels(file).then((labels) => {
          setFile(URL.createObjectURL(file));

          const image = {
            name: file.name,
            labels: labels,
            file: {
              bucket: awsExports.aws_user_files_s3_bucket,
              region: awsExports.aws_user_files_s3_bucket_region,
              key: file.name,
            },
          };

          addImageToDB(image);
          console.log('added completed');
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container className="HomePage">
      <div className={classes.root}>
        <p>Please select an image to upload.</p>
        <p>Wait for image to appear.</p>
        <p>Dont upload images that cannot be auto-tagged pls :)</p>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
          onChange={(evt) => onChange(evt)}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Upload
          </Button>
        </label>
        <input
          accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file"
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
        <div>
          <img width="300px" src={file} alt="" />
        </div>
      </div>
    </Container>
  );
};

export default UploadImage;
