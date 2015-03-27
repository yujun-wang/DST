/**
* Adds a Bootstrap tooltip confirmation to links or buttons
*
*	<tag tooltip-confirm="dothis()"/>
*
*	<tag tooltip-confirm="dothis()" tooltip-confirm-text="Are you sure?" tooltip-confirm-position="top"/>
*
*	* See scope for more config options
*
* @author Matt Carter <m@ttcarter.com>
* @date 2014-11-04
*/
app.directive('tooltipConfirm', function() {
	return {
		scope: {
			tooltipConfirm: '&?', // Run this on confirm
			tooltipCancel: '&?', // Run this on cancel
			tooltipConfirmText: '@',
			tooltipConfirmPosition: '@?',
			tooltipConfirmContainer: '@?',
			tooltipConfirmTrigger: '@?'
		},
		restrict: 'A',
		controller: function($scope) {
			$scope.doConfirm = function() {
				if ($scope.tooltipConfirm)
					$scope.$eval($scope.tooltipConfirm);
			};

			$scope.doCancel = function() {
				if ($scope.tooltipConfirmCancel)
					$scope.$eval($scope.tooltipConfirmCancel);
			};
		},
		link: function($scope, elem) {
			$scope.$watch('tooltipConfirm + tooltipConfirmText + tooltipPConfirmosition + tooltipCConfirmontainer + tooltipConfirmTrigger', function() {
				var isVisible = $(elem).siblings('.tooltip').length > 0; // Is the tooltip already shown?
				$(elem)
					.tooltip('destroy')
					.tooltip({
						title: 
							'<div class="tooltip-confirm">' +
								'<div class="tooltip-confirm-text">' + ($scope.tooltip || 'Are you sure?') + '</div>' +
								'<div class="tooltip-confirm-btn-group">' +
									'<a class="btn btn-xs btn-success tooltip-confirm-btn-confirm">Yes</a>' +
									'<a class="btn btn-xs btn-danger tooltip-confirm-btn-cancel">No</a>' +
								'</div>' +
							'</div>',
						html: true,
						placement: $scope.tooltipConfirmPosition || 'top',
						container: $scope.tooltipConfirmContainer || null,
						trigger: $scope.tooltipConfirmTrigger || 'click',
						animation: false
					})
					.on('show.bs.tooltip', function(e) {
						if (!$(this).data('ng.tooltip-confirm')) { // Not yet attached events
							$(this).data('bs.tooltip').$tip // Shown - bind to click of buttons
								.on('click', '.tooltip-confirm-btn-confirm', function() {
									$(elem).tooltip('hide');
									$scope.$apply($scope.doConfirm);
								})
								.on('click', '.tooltip-confirm-btn-cancel', function() {
									$(elem).tooltip('hide');
								});
							$(this).data('ng.tooltip-confirm', true);
						}
					});

				
					/*
					.data('bs.tooltip')
					*/

				if (isVisible) // Reshow the tooltip if we WERE using it before
					$(elem).tooltip('show');
			});
		}
	}
});
