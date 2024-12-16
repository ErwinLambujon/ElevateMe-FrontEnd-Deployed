import {
  Box,
  Grid,
  Typography,
  Divider,
  Avatar,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const RankingSection = ({ teamRankings, teacherRankings }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Team's Ranking */}
        <Grid item xs={12} md={5}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Team’s Ranking
          </Typography>
          {teamRankings.map((member) => (
            <Card
              key={member.name}
              sx={{
                mb: 2,
                boxShadow: 2,
                borderRadius: 4,
                fontWeight: "bold",
                minWidth: "300px",
                height: "120px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              
                <Box sx={{ flex: 1, minWidth: "200px" }}>
                  <Box sx={{ display: "flex", flexDirection: "row", mb:.5 }}>
                  <Avatar
                  sx={{
                    width: 30, 
                    height: 30,
                    backgroundColor: "#67A099",
                    fontSize: "1rem",
                    mr: 1,
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>
                  <Typography variant="h6" sx={{ textAlign: "left",  fontWeight:"bold",
 }}>
                    {member.name}
                  </Typography>
                  </Box>
             
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "left",
                      fontSize: "0.875rem",
                      lineHeight: 1.3,
                      maxWidth: "360px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2, 
                      fontWeight:'medium',
                      marginLeft: 1,
                      color:"text.secondary"
                    }}
                  >
                    {member.content}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#186F65",
                    ml: "auto",
                    textAlign: "right",
                    minWidth: "60px",
                  }}
                >
                  {member.points} pts
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Divider */}
        <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          {isSmallScreen ? (
            <Divider
              flexItem
              sx={{ borderColor: "#186F65", borderWidth: 2, width: "400px", my: 2 }}
            />
          ) : (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "#186F65", borderWidth: 2, height: "500px", marginLeft:0, marginRight: 0 }}
            />
          )}
        </Grid>

        {/* Teacher's Ranking */}
        <Grid item xs={12} md={5}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Teacher’s Ranking
          </Typography>
          {teacherRankings.map((member) => (
            <Card
              key={member.name}
              sx={{
                mb: 2,
                boxShadow: 2,
                borderRadius: 4,
                minWidth: "300px",
                height: "120px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Box sx={{ flex: 1, minWidth: "200px" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", mb:.5 }}>
                <Avatar
                  sx={{
                    width: 30, // Smaller size
                    height: 30,
                    backgroundColor: "#67A099",
                    fontSize: "1rem",
                    fontWeight: 'bold',
                    mr: .5,
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>
                
                  <Typography variant="h6" sx={{ textAlign: "left", mb: 0.5, fontWeight: 'bold' }}>
                    {member.name}
                  </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "left",
                      fontSize: "0.875rem",
                      lineHeight: 1.3,
                      maxWidth: "360px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      fontWeight:"medium",
                      color: "text.secondary",
                      ml: 1,
                      WebkitLineClamp: 2, // Limits to 2 lines with ellipsis
                    }}
                  >
                    {member.content}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#186F65",
                    ml: "auto",
                    textAlign: "right",
                    minWidth: "60px",
                  }}
                >
                  {member.points} pts
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RankingSection;
