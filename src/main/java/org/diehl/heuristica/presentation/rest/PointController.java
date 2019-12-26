package org.diehl.heuristica.presentation.rest;

import org.diehl.heuristica.application.HeuristicaAPI;
import org.diehl.heuristica.application.dto.DetailedPoints;
import org.diehl.heuristica.domain.model.Circle;
import org.diehl.heuristica.domain.model.Point;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.concurrent.CompletionStage;

@Path("/points")
public class PointController {

    @Inject
    HeuristicaAPI heuristicaAPI;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public CompletionStage<DetailedPoints> getRandomPoints() {
        return heuristicaAPI.generateRandomPoints();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/circle/{id}")
    public CompletionStage<Circle> getMinimumCircle(@PathParam("id") String id) {
        return heuristicaAPI.minimumCircle(id);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/convex/{id}")
    public CompletionStage<List<Point>> getConvexEnvelope(@PathParam("id") String id) {
        return heuristicaAPI.convexEnvelope(id);
    }
}
