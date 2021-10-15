import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import flickrAPI from './utils/flickr-api.js'
import './App.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';


const DEFAULT_SEARCH_TERM = "holiday"
const DEFAULT_SAFE_SEARCH = 1


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: DEFAULT_SEARCH_TERM,
      safeSearch: DEFAULT_SAFE_SEARCH,
      page: 1,
      totalPages: Infinity,
      photos: [],
      error: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getMorePhotos = this.getMorePhotos.bind(this);
    this.getPhoto = this.getPhoto.bind(this);
  }

  componentDidMount(){
    this.getPhoto();
  }

  handleChange(event) {
    if (event.target.id === "safesearch") {
      console.debug("SafeSearch value" + event.target.value);
      this.setState({
        safeSearch: event.target.value,
        page: 1,
        photos: [],
        error: null
      }, this.getPhoto);
    } 
    if (event.target.id === "text") {
      this.setState({
        text: event.target.value
      });  
    }     
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.newSearch(event.target.value)
    }
  }

  handleClick(event){
    if (event.target.id === 'reload') {
      window.location.reload(true)
    } else {
      this.newSearch(event.target.value)
    }    
  }

  newSearch(text){
    this.setState({
      text: text,
      page: 1,
      photos: [],
      error: null
    }, this.getPhoto);
  }

  throwError(error){
    console.error(error.message);    
    this.setState({
      error: error
    });    
  }

  getMorePhotos =() => {
    this.setState({
      page: this.state.page + 1
    }, this.getPhoto)
  }

  getPhoto = async() => {
    let result = await flickrAPI(this.state.text, this.state.safeSearch, this.state.page);
    if (!(result instanceof Error)) {
      try {
        this.setState({
          totalPages: result.photos.pages,
          photos: this.state.photos.concat(result.photos.photo)
        });                
      } catch (error){
        this.throwError(error);
      }
    } else {
      this.throwError(result);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="container my-12 mx-auto px-4 md:px-12">
          <h1 className="text-6xl	text-black font-display py-2">Flickr Phohto Stream</h1>
          <ToolBar
            safeSearch={this.state.safeSearch}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            text={this.state.text}
          />
          <InfiniteScrollContainer
            photos={this.state.photos}
            page={this.state.page}
            totalPages={this.state.totalPages}
            next={this.getMorePhotos}
            onClick={this.handleClick}
            error={this.state.error}
          />
        </div>
      </div>
    );
  }
}

const ToolBar =(props) => {
  return (
    <div className="flex flex-wrap py-3">
      <SafeSearch safeSearch={props.safeSearch} onChange={props.onChange}/>
      <div className="w-fill md:w-2/6 lg:w-3/6"></div>
      <SearchBox text={props.text} onChange={props.onChange} onKeyPress={props.onKeyPress} />
    </div>
  )
}
const SafeSearch = (props) => {
  return (
    <div className="w-full md:w-2/6 lg:w-1/6 mb-1 md:mb-0">
      <div className="relative">
        <select
          className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="safesearch"
          role="list"
          value={props.safeSearch}
          onChange={props.onChange}
        >
          <option value="1">SafeSearch on</option>
          <option value="2">SafeSearch moderate</option>
          <option value="3">SafeSearch off</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>    
  );
}

const SearchBox = (props) => {
  return (
    <div className="w-full md:w-2/6">
      <input
        className="appearance-none block w-full bg-white border border-gray-200 text-gray-700 text-sm rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="text"
        type="text"
        role="search"
        placeholder="tags, title and / or description"
        value={props.text}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
      />
    </div>
  );
}

const InfiniteScrollContainer = (props) => {
  return (
    <InfiniteScroll
      dataLength={props.photos.length}
      next={props.next}
      hasMore={props.page < props.totalPages}
      loader={<InfiniteScrollLoader error={props.error} onClick={props.onClick} />}
      endMessage={<InfiniteScrollEndMessage />}
      className="flex flex-wrap -mx-1 lg:-mx-4"
    >
      {props.photos.map((photo, index) => <PhotoBox photo={photo} key={index} onClick={props.onClick} />)}
    </InfiniteScroll>
  );
}

const InfiniteScrollLoader = (props) => {
  if (!props.error)
    return (
      <h4 className="animate-pulse bg-gray-200 text-center w-full m-1 lg:m-4 py-4 rounded-lg">Loading...</h4>
    );
  else 
    return (
      <div className="flex items-center justify-center bg-red-200 text-red-700 text-center w-full m-1 lg:m-4 py-4 rounded-lg">
        <h4 className="w-full align-middle" role="alert">{props.error.message}</h4>
        <button
          id="reload"
          className="w-auto text-white text-sm bg-red-900 hover:bg-red-700 mx-2 px-2 py-2 rounded-lg"
          onClick={props.onClick}>
          Reload
        </button>         
      </div>
    );  
}

const InfiniteScrollEndMessage = (props) => {
  return (
    <p className="text-center	font-bold text-4xl text-gray-500 w-full m-8">
      Yay! You have seen it all!
    </p>
  );
}

const PhotoBox = (props) => {
  let title = props.photo.title ? props.photo.title : "No title";
  let photoURL = `https://www.flickr.com/photos/${props.photo.owner}/${props.photo.id}`

  return(
    <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 xl:w-1/4">
      <div className="overflow-hidden rounded-lg shadow-lg pb-2 md:pb-4">
          <Image title={title} photoURL={photoURL} imgSrc={props.photo.url_m} />
          <Title title={title} photoURL={photoURL} />
          <UserInfo
            owner={props.photo.owner}
            ownername={props.photo.ownername}
            iconfarm={props.photo.iconfarm} 
            iconserver={props.photo.iconserver}
          />
          <Content content={props.photo.description._content.replace(/<[^>]+>/g, '')} />
          <TagFooter tags={props.photo.tags} onClick={props.onClick} />
      </div>
    </div>
  ); 
}

const Image = (props) => {
  return(
    <a href={props.photoURL} target="_blank" rel="noreferrer">
      <div className="overflow-hidden flex items-center justify-center sm:h-full md:h-52 lg:h-44 w-full bg-gray-900">
        <LazyLoadImage
          alt={props.title}
          src={props.imgSrc}
          className="block overflow-hidden hover:opacity-80 sm:w-auto sm:h-full md:w-full md:h-auto text-white border-none"
          effect="opacity"
        />
      </div>
    </a>
  );
}

const Title = (props) => {
  return (
    <div className="pb-0 md:pb-0 p-2 md:p-4">
      <p className="text-lg truncate">
        <a className="no-underline hover:underline text-black" href={props.photoURL} target="_blank" rel="noreferrer">
          {props.title}
        </a> 
      </p>
    </div>
  );
}

const UserInfo = (props) => {
  let profileURL = `https://www.flickr.com/photos/${props.owner}/`
  let buddyIconURL = (props.iconserver > 0) ?
  `http://farm${props.iconfarm}.staticflickr.com/${props.iconserver}/buddyicons/${props.owner}.jpg` :
  "https://www.flickr.com/images/buddyicon.gif"

  return(
    <div className="pb-0 md:pb-0 p-2 md:p-4">
      <a className="flex items-center no-underline hover:underline text-black" href={profileURL} target="_blank" rel="noreferrer">
        <img alt={props.ownername} className="block w-8 h-8 rounded-full" src={buddyIconURL} />
        <p className="ml-2 text-sm truncate">
          {props.ownername}
        </p>
      </a>
    </div>
  );             
}

const Content = (props) => {
  if (props.content.trim() === "") return "";
  return (
    <div className="pb-0 md:pb-0 p-2 md:p-4">
      <p className="text-gray-500 text-sm overflow-y-scroll max-h-20">
        {props.content}
      </p>
    </div>  
  );
}

const TagFooter = (props) => {
  let tags = props.tags.split(" ");
  if (tags.length <= 1) return "";
  return (
    <div className="pb-0 md:pb-0 p-2 md:p-4">
      <div className="overflow-x-scroll max-h-24" >
      {tags.map((tag, index) => <TagButton tag={tag} key={index} onClick={props.onClick} />)}
      </div>
    </div>
  );
}

const TagButton = (props) => {
  return(
    <button className="mr-1 mb-1 p-2 rounded-lg text-xs bg-gray-200 inline-block text-black hover:bg-gray-600 hover:text-white"
        onClick={props.onClick}
        value={props.tag}
    >
      {props.tag}
    </button>
  );
}

export default App;
