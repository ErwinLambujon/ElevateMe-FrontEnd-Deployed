// components/CommentCard.js
import { Box, Card, Typography, Avatar } from "@mui/material";

const CommentCard = ({ author, content }) => {
    return (
        <Card sx={{ borderRadius: 4, boxShadow: 2, padding: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar sx={{ marginRight: 2 }}>{author.charAt(0)}</Avatar>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>{author}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
                {content}
            </Typography>
        </Card>
    );
};

export default CommentCard;
