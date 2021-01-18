import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import SearchImage from './SearchImage';
import ImageGallery from './ImageGallery';

import { Storage, API, graphqlOperation } from 'aws-amplify';
import { listPictures, searchPictures } from '../graphql/queries';
import { deletePicture } from '../graphql/mutations';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
    };
  }

  getAllImagesToState = async () => {
    const result = await API.graphql(graphqlOperation(listPictures));
    let imageArray = await this.buildImageArray(result.data.listPictures.items);
    this.setState({ images: imageArray });
  };

  async componentDidMount() {
    await this.getAllImagesToState();
  }

  async buildImageArray(listPictures) {
    return await this.getImagesFileList(listPictures);
  }

  async getImagesFileList(imageList) {
    return Promise.all(
      imageList.map(async (i) => {
        return this.getOneFormatedImage(i);
      })
    );
  }

  async getOneFormatedImage(image) {
    return {
      src: await Storage.get(image.file.key),
      id: image.id,
      labels: image.labels,
    };
  }

  deleteImage = async (imageId) => {
    const id = {
      id: imageId,
    };
    await API.graphql(graphqlOperation(deletePicture, { input: id }));
    console.log(this.state.images);
    this.setState({
      images: this.state.images.filter((value, index, arr) => {
        return value.id !== imageId;
      }),
    });
  };

  searchImage = async (searchLabel) => {
    var result;

    // when no search filter is passed, revert back to full list
    if (searchLabel.label === '') {
      await this.getAllImagesToState();
    } else {
      // search
      const filter = {
        labels: {
          match: {
            labels: searchLabel,
          },
        },
      };

      result = await API.graphql(
        graphqlOperation(searchPictures, { filter: filter })
      );

      if (result.data.searchPictures.items.length > 0) {
        let imageArray = await this.buildImageArray(
          result.data.searchPictures.items
        );
        this.setState({ images: imageArray });
      } else {
        this.setState({
          images: [],
        });
      }
    }
  };

  render() {
    return (
      <Container className="HomePage">
        <Typography variant="h5">Image Gallery</Typography>
        <SearchImage searchImage={this.searchImage} />
        <Grid container justify="center" spacing={3}>
          <ImageGallery
            images={this.state.images}
            deleteImage={this.deleteImage}
          />
        </Grid>
      </Container>
    );
  }
}

export default HomePage;
