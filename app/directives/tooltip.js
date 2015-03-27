/**
* Adds a Bootstrap tooltip to an element
*
*	<tag tooltip="hello world"/>
*
*	<tag tooltip="hello world" tooltip-position="bottom" tooltip-container="body" tooltip-trigger="click"/>
*
* @author Matt Carter <m@ttcarter.com>
* @date 2014-11-04
*/
app.directive('tooltip', function() {
	return {
		scope: {
			tooltip: '@',
			tooltipPosition: '@?',
			tooltipContainer: '@?',
			tooltipTrigger: '@?'
		},
		restrict: 'A',
		link: function($scope, elem) {
			$scope.$watch('tooltip + tooltipPosition + tooltipContainer + tooltipTrigger', function() {
				var isVisible = $(elem).siblings('.tooltip').length > 0; // Is the tooltip already shown?
				$(elem)
					.tooltip('destroy')
					.tooltip({
						title: $scope.tooltip,
						placement: $scope.tooltipPosition || 'top',
						container: $scope.tooltipContainer || null,
						trigger: $scope.tooltipTrigger || 'hover',
						animation: false
					});

				if (isVisible) // Reshow the tooltip if we WERE using it before
					$(elem).tooltip('show');
			});
		}
	}
});
