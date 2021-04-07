import React, {useEffect, useState} from 'react';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TitleBar from 'frameless-titlebar';
import {remote} from 'electron';
import {Proskomma} from 'proskomma';
import fse from 'fs-extra';
import path from 'path';

import Footer from './footer';
import DocSets from './doc_sets';
import Browse from './browse';
import Search from './search';
import PkQuery from './pk_query';
// import Import from './import';
import icon from '../assets/icons/48x48.ico';

const pk = new Proskomma();
let timeToLoad = Date.now();
pk.loadSuccinctDocSet(fse.readJsonSync(path.resolve(__dirname, '../data/ult_nt.json')));
timeToLoad = Date.now() - timeToLoad;
const currentWindow = remote.getCurrentWindow();

export default function App() {
  const [maximized, setMaximized] = useState(currentWindow.isMaximized());
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedDocSet, setSelectedDocSet] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [savedQueries, setSavedQueries] = React.useState([]);
  const [selectedBook, setSelectedBook] = React.useState('MRK');
  const [selectedChapter, setSelectedChapter] = React.useState('1');
  const [selectedVerse, setSelectedVerse] = React.useState('1');
  const state = {
    tabIndex: {
      get: tabIndex,
      set: setTabIndex,
    },
    selectedDocSet: {
      get: selectedDocSet,
      set: setSelectedDocSet,
    },
    selectedDocument: {
      get: selectedDocument,
      set: setSelectedDocument,
    },
    savedQueries: {
      get: savedQueries,
      set: setSavedQueries,
    },
    selectedBook: {
      get: selectedBook,
      set: setSelectedBook,
    },
    selectedChapter: {
      get: selectedChapter,
      set: setSelectedChapter,
    },
    selectedVerse: {
      get: selectedVerse,
      set: setSelectedVerse,
    },
  };
  useEffect(() => {
    const onMaximized = () => setMaximized(true);
    const onRestore = () => setMaximized(false);
    currentWindow.on('maximize', onMaximized);
    currentWindow.on('unmaximize', onRestore);
    return () => {
      currentWindow.removeListener('maximize', onMaximized);
      currentWindow.removeListener('unmaximize', onRestore);
    };
  }, []);

  const handleMaximize = () => {
    if (maximized) {
      currentWindow.restore();
    } else {
      currentWindow.maximize();
    }
  };

  return (
    <React.Fragment>
      <TitleBar
        title="Chaliki (powered by Proskomma)"
        iconSrc={icon}
        currentWindow={currentWindow}
        onMaximize={handleMaximize}
        onDoubleClick={handleMaximize}
        onMinimize={() => currentWindow.minimize()}
        onClose={() => currentWindow.close()}
        maximized={maximized}
      />
      <Tabs
        selectedIndex={tabIndex}
        onSelect={index => setTabIndex(index)}
        className="top_tabs"
      >
        <TabList>
          <Tab>DocSets</Tab>
          <Tab>Browse</Tab>
          <Tab>Search</Tab>
          <Tab>Pk Query</Tab>
        </TabList>
        <TabPanel>
          <DocSets
            pk={pk}
            timeToLoad={timeToLoad}
            state={state}
          />
        </TabPanel>
        <TabPanel>
          <Browse pk={pk} state={state}/>
        </TabPanel>
        <TabPanel>
          <Search pk={pk} state={state}/>
        </TabPanel>
        <TabPanel>
          <PkQuery
            pk={pk}
            state={state}
          />
        </TabPanel>
      </Tabs>
      <Footer/>
    </React.Fragment>
  )
    ;
}
