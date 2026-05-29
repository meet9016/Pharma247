import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { Box, Card } from '@mui/material'; // Assuming you're using Material-UI
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@headlessui/react';

const StaffOverview = ({ pieChart, pieChartvalue, handlestaffTabchange, data }) => {
  return (
    <Card style={{ width: '100%' }}>
      <div className='p-2'>
        <div>
          <p className='font-bold'>Staff Overview</p>
          <div className='pt-2'>
            <div className="flex justify-center sm:gap-4 gap-2">
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={pieChartvalue}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList aria-label="lab API tabs example" onChange={handlestaffTabchange}>
                      {pieChart.map((e) => (
                        <Tab key={e.id} value={e.id} label={e.value} />
                      ))}
                    </TabList>
                  </Box>
                  {pieChart.map((e) => (
                    <TabPanel key={e.id} value={e.id}>
                      {/* Replace PieChart with GaugeChart */}
                      <GaugeChart
                        id={`gauge-chart-${e.id}`}
                        nrOfLevels={30}
                        arcsLength={[0.3, 0.5, 0.2]} // Adjust the lengths of the arcs
                        colors={['#FF0000', '#FFCA28', '#2ECC71']} // Colors for the arcs
                        percent={data[e.id]} // Assuming data[e.id] gives you the percentage for the gauge
                        arcPadding={0.02}
                        style={{ height: '250px' }} // Adjust height as needed
                      />
                    </TabPanel>
                  ))}
                </TabContext>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StaffOverview;