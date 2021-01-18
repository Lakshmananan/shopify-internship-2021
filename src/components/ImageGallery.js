import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
  },
  media: {
    height: 500,
  },
});

const ImageGallery = (props) => {
  const classes = useStyles();

  console.log(props.images);

  return (
    <Fragment>
      {props.images.map((image) => (
        <Grid key={image.id} item>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia className={classes.media} image={image.src} />
              <CardContent>
                {image.labels.map((label, i) => (
                  <Chip key={i} label={label} className="img-label" />
                ))}
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  props.deleteImage(image.id);
                }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Fragment>
  );
};

export default ImageGallery;
