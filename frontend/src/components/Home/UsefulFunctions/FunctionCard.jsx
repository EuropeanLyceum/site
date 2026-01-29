import {Card, CardActionArea, Typography} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function FunctionCard({
                                         href,
                                         image,
                                         title,
                                         onClick,
                                         wide = false,
                                     }) {
    const Wrapper = href ? Link : "div";

    return (
        <Card className={`card ${wide ? "wide-card" : ""}`}>
            <CardActionArea
                component={Wrapper}
                href={href}
                onClick={onClick}
                className="card"
            >
                <Image src={image} alt={title}/>
                <div className="card-gradient"/>
                <Typography className="card-title">{title}</Typography>
            </CardActionArea>
        </Card>
    );
}