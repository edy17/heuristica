package org.diehl.heuristica.presentation.rest;

import org.diehl.heuristica.domain.service.RandomPointsGenerator;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.awt.*;
import java.util.List;
import java.util.concurrent.CompletionStage;

@Path("/points")
public class PointController {

    @Inject
    RandomPointsGenerator generator;


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public CompletionStage<List<Point>> getPoints() {
        return generator.generateRandomPoints();
    }

}
