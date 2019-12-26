package org.diehl.heuristica.application;

import org.diehl.heuristica.application.dto.DetailedPoints;
import org.diehl.heuristica.domain.model.Circle;
import org.diehl.heuristica.domain.model.Point;
import org.diehl.heuristica.domain.service.ConvexEnvelopeService;
import org.diehl.heuristica.domain.service.MTSPService;
import org.diehl.heuristica.domain.service.MinimumCircleService;
import org.diehl.heuristica.domain.service.TSPService;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@ApplicationScoped
public class HeuristicaAPI {

    private static int maxWidth = 1200;
    private static int maxHeight = 600;
    private static final ConcurrentMap<String, DetailedPoints> randomPointsSessions = new ConcurrentHashMap<>();
    @Inject
    private MinimumCircleService minimumCircleService;
    @Inject
    private ConvexEnvelopeService convexEnvelopeService;
    @Inject
    private TSPService tspService;
    @Inject
    private MTSPService mtspService;


    public CompletableFuture<DetailedPoints> generateRandomPoints() {
        return CompletableFuture.supplyAsync(() -> {
            ArrayList<Point> points = new ArrayList<>();
            Random generator = new Random();
            int numberOfPoints = 1000;
            int i = 0;
            while (i < numberOfPoints) {
                int x;
                int y;
                x = generator.nextInt(maxWidth);
                y = generator.nextInt(maxHeight);
                if ((((distanceToCenter(x, y, 1f / 4f) < 200) || (distanceToCenter(x, y, 3f / 4f) < 200))
                        && ((distanceToCenter(x, y, 1f / 4f) > 210) || (distanceToCenter(x, y, 3f / 4f) > 210))
                        && (distanceToCenter(x, y, 1f / 2f) < 300))
                        || (distanceToCenter(x, y, 1f / 2f) < 200)) {
                    points.add(new Point(x, y));
                    i++;
                }
            }
            String sessionUUID = UUID.randomUUID().toString();
            DetailedPoints detailedPoints = new DetailedPoints(sessionUUID, points);
            randomPointsSessions.put(sessionUUID, detailedPoints);
            return detailedPoints;
        });
    }

    private double distanceToCenter(int x, int y, float centerWidthRatio) {
        return Math.sqrt(Math.pow((double) (x - maxWidth * centerWidthRatio), 2.0D) + Math.pow((double) (y - maxHeight / 2), 2.0D));
    }

    public CompletableFuture<Circle> minimumCircle(String sessionUUID) {
        return CompletableFuture.supplyAsync(() -> {
            if (randomPointsSessions.containsKey(sessionUUID)) {
                DetailedPoints detailedPoints = randomPointsSessions.get(sessionUUID);
                Circle circle = minimumCircleService.process(detailedPoints.getRandomPoints());
                detailedPoints.setMinimumCircle(circle);
                detailedPoints.setConsumedMinimumCircle(true);
                if (detailedPoints.sessionDetailedPointsHasExpired()) randomPointsSessions.remove(sessionUUID);
                return circle;
            }
            return null;
        });
    }

    public CompletableFuture<List<Point>> convexEnvelope(String sessionUUID) {
        return CompletableFuture.supplyAsync(() -> {
            if (randomPointsSessions.containsKey(sessionUUID)) {
                DetailedPoints detailedPoints = randomPointsSessions.get(sessionUUID);
                ArrayList<Point> points = convexEnvelopeService.process(detailedPoints.getRandomPoints());
                if (detailedPoints.sessionDetailedPointsHasExpired()) randomPointsSessions.remove(sessionUUID);
                return points;
            }
            return null;
        });
    }

    public CompletableFuture<List<Point>> tsp(String sessionUUID) {
        return CompletableFuture.supplyAsync(() -> {
            if (randomPointsSessions.containsKey(sessionUUID)) {
                DetailedPoints detailedPoints = randomPointsSessions.get(sessionUUID);
                ArrayList<Point> points = tspService.process(detailedPoints.getRandomPoints());
                if (detailedPoints.sessionDetailedPointsHasExpired()) randomPointsSessions.remove(sessionUUID);
                return points;
            }
            return null;
        });
    }

    public CompletableFuture<List<Point>> mtsp(String sessionUUID) {
        return CompletableFuture.supplyAsync(() -> {
            if (randomPointsSessions.containsKey(sessionUUID)) {
                DetailedPoints detailedPoints = randomPointsSessions.get(sessionUUID);
                ArrayList<Point> points = mtspService.process(detailedPoints.getRandomPoints());
                if (detailedPoints.sessionDetailedPointsHasExpired()) randomPointsSessions.remove(sessionUUID);
                return points;
            }
            return null;
        });
    }
}
