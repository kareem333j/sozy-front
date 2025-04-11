import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, Grid, Typography } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export const DashboardPageAdmin = () => {
  return (
    <>
      <Helmet>
        <title>Engineering Sozy | الرئيسية</title>
      </Helmet>
      <div className="admin-dashboard w-100">
        <Accordion defaultExpanded={true} className='p-0 m-0' sx={{ 'boxShadow': 'none', 'backgroundColor': 'var(--main-back2)' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ 'color': 'var(--main-color)' }} />}
            aria-controls="panel1-content"
            id="panel1-header"
            className='p-0 m-0'
          >
            <Typography sx={{ 'color': 'var(--main-color)' }} component="span"><span style={{ fontSize: '1.1rem' }} className='d-flex'><ArrowRightIcon sx={{ color: 'var(--main-blue-sky)' }} /> الكورسات</span></Typography>
          </AccordionSummary>
          <AccordionDetails className='p-0 m-0' sx={{ 'color': 'var(--main-color)' }}>
            <Box sx={{ width: '100%', overflow: 'hidden', marginBottom: 3 }}>
              <Grid container spacing={2} sx={{ maxWidth: '100%', margin: 'auto', padding: 0 }}>
                <Grid item xs={12} sm={6} md={4} lg={4} className="mb-2">
                  <Card sx={{ maxWidth: 345, borderRadius: '10px', margin: 'auto' }}>
                    <CardActionArea component={Link} to='/courses/all courses' className="d-flex justify-content-center align-items-center flex-column gap-4 p-3">
                      <div>
                        <SchoolIcon sx={{ width: '50px', height: '50px' }} />
                      </div>
                      <div>
                        <h3>جميع الكورسات</h3>
                      </div>
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} className="mb-2">
                  <Card sx={{ maxWidth: 345, borderRadius: '10px', margin: 'auto' }}>
                    <CardActionArea component={Link} to='/courses/add course' className="d-flex justify-content-center align-items-center flex-column gap-4 p-3">
                      <div>
                        <AddToPhotosIcon sx={{ width: '50px', height: '50px' }} />
                      </div>
                      <div>
                        <h3>إضافة كورس جديد</h3>
                      </div>
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} className="mb-2">
                  <Card sx={{ maxWidth: 345, borderRadius: '10px', margin: 'auto' }}>
                    <CardActionArea component={Link} to='/courses/add video' className="d-flex justify-content-center align-items-center flex-column gap-4 p-3">
                      <div>
                        <AddBoxIcon sx={{ width: '50px', height: '50px' }} />
                      </div>
                      <div>
                        <h3>إضافة فيديو جديد</h3>
                      </div>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true} className='p-0 m-0' sx={{ 'boxShadow': 'none', 'backgroundColor': 'var(--main-back2)' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ 'color': 'var(--main-color)' }} />}
            aria-controls="panel1-content"
            id="panel1-header"
            className='p-0 m-0'
          >
            <Typography sx={{ 'color': 'var(--main-color)' }} component="span"><span style={{ fontSize: '1.1rem' }} className='d-flex'><ArrowRightIcon sx={{ color: 'var(--main-blue-sky)' }} /> المستخدمين</span></Typography>
          </AccordionSummary>
          <AccordionDetails className='p-0 m-0' sx={{ 'color': 'var(--main-color)' }}>
            <Box sx={{ width: '100%', overflow: 'hidden', marginBottom: 3 }}>
              <Grid container spacing={2} sx={{ maxWidth: '100%', margin: 'auto', padding: 0 }}>
                <Grid item xs={12} sm={6} md={4} lg={4} className="mb-2">
                  <Card sx={{ maxWidth: 345, borderRadius: '10px', margin: 'auto' }}>
                    <CardActionArea component={Link} to='/users/manage' className="d-flex justify-content-center align-items-center flex-column gap-4 p-3">
                      <div>
                        <ManageAccountsIcon sx={{ width: '50px', height: '50px' }} />
                      </div>
                      <div>
                        <h3>إدارة المستخدمين</h3>
                      </div>
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} className="mb-2">
                  <Card sx={{ maxWidth: 345, borderRadius: '10px', margin: 'auto' }}>
                    <CardActionArea component={Link} to='/users/subscriptions' className="d-flex justify-content-center align-items-center flex-column gap-4 p-3">
                      <div>
                        <SubscriptionsIcon sx={{ width: '50px', height: '50px' }} />
                      </div>
                      <div>
                        <h3>الإشتراكات</h3>
                      </div>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  )
}
