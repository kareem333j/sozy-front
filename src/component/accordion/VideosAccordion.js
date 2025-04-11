import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './accordion.css'
import VideosList from '../videos/VideosList';
import { NoVideos } from '../no-data/NoVideos';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


export default function VideosAccordion({data}) {
  const coursesData = data

  return (
    coursesData.map((e, index) => {
      return (
        <Accordion key={index} defaultExpanded={(e.videos.length === 0)?false:true} className='p-0 m-0' sx={{ 'boxShadow': 'none', 'backgroundColor': 'var(--main-back2)' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ 'color': 'var(--main-color)' }} />}
            aria-controls="panel1-content"
            id="panel1-header"
            className='p-0 m-0'
          >
            <Typography sx={{ 'color': 'var(--main-color)' }} component="span"><span className='d-flex'><ArrowRightIcon sx={{color:'var(--main-blue-sky)'}}/> {e.title.charAt(0).toUpperCase()+ e.title.slice(1)} Course Videos</span></Typography>
          </AccordionSummary>
          <AccordionDetails className='p-0 m-0' sx={{ 'color': 'var(--main-color)' }}>
            {
              (e.videos.length === 0) ? <NoVideos imgStyle={{width:'150px'}} msg='لم يتم تحميل فيديوهات في هذا الكورس حتي الأن..!'/> : <VideosList loading={false} dataCourse={e} videos={e.videos} />
            }
          </AccordionDetails>
        </Accordion>
      )
    })
  );
}